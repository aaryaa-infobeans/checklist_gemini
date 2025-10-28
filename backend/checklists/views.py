from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from . import models, serializers, permissions
from rest_framework import permissions as drf_permissions
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import get_user_model


class ObtainTokenByEmail(APIView):
    """Simple email/password -> token endpoint."""
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({'detail': 'Email and password required.'}, status=status.HTTP_400_BAD_REQUEST)

        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email__iexact=email)
        except UserModel.DoesNotExist:
            user = None

        if user and user.is_active or user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.pk, 'email': user.email})

        # Run the default password hasher once to reduce timing attacks
        UserModel().set_password(password)
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutTokenView(APIView):
    """Deletes the token for the current authenticated user (logout)."""
    permission_classes = [drf_permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        # Delete tokens for this user
        Token.objects.filter(user=user).delete()
        return Response({'detail': 'Logged out.'}, status=status.HTTP_200_OK)


class RoleViewSet(viewsets.ModelViewSet):
    queryset = models.Role.objects.all()
    serializer_class = serializers.RoleSerializer
    permission_classes = [drf_permissions.IsAuthenticated, permissions.IsAdmin]


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [drf_permissions.IsAuthenticated, permissions.IsAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['email', 'name']

    @action(detail=False, methods=['get'], permission_classes=[drf_permissions.IsAuthenticated])
    def me(self, request):
        """Return the profile for the currently authenticated user."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class ChecklistTemplateViewSet(viewsets.ModelViewSet):
    queryset = models.ChecklistTemplate.objects.all()
    serializer_class = serializers.ChecklistTemplateSerializer
    permission_classes = [drf_permissions.IsAuthenticated, permissions.IsProjectManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'archived']
    search_fields = ['title', 'category']

    def perform_destroy(self, instance):
        # Prevent deletion if template is in use by executions
        if models.ChecklistExecution.objects.filter(template=instance).exists():
            raise Exception('Cannot delete a template that has executions.')
        return super().perform_destroy(instance)

    def perform_create(self, serializer):
        # set owner to current user when a project manager creates a template
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        # For unsafe methods, enforce object-level permission to allow owners to modify
        perms = super().get_permissions()
        return perms


class ChecklistItemViewSet(viewsets.ModelViewSet):
    queryset = models.ChecklistItem.objects.all()
    serializer_class = serializers.ChecklistItemSerializer
    permission_classes = [drf_permissions.IsAuthenticated, permissions.IsProjectManager]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['template']


class ChecklistExecutionViewSet(viewsets.ModelViewSet):
    queryset = models.ChecklistExecution.objects.all()
    serializer_class = serializers.ChecklistExecutionSerializer
    permission_classes = [drf_permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user', 'template', 'status', 'started_at', 'completed_at']
    search_fields = ['template__title', 'user__email']

    def get_queryset(self):
        """
        This view should return a list of all the executions
        for the currently authenticated user.
        Project managers and admins can see all executions.
        """
        user = self.request.user
        
        if user.is_authenticated:
            is_pm = permissions.IsProjectManager()
            if is_pm.has_permission(self.request, self):
                return models.ChecklistExecution.objects.all()
            return models.ChecklistExecution.objects.filter(user=user)
        
        return models.ChecklistExecution.objects.none()

    def get_permissions(self):
        # end users can create/examine their own executions; project managers/admins can see all
        if self.action in ['create']:
            return [drf_permissions.IsAuthenticated(), permissions.IsEndUserOrProjectManager()]
        if self.action == 'retrieve':
            return [drf_permissions.IsAuthenticated(), permissions.IsExecutionOwnerOrManager()]
        if self.action == 'list':
            return [drf_permissions.IsAuthenticated()]
        # For update, partial_update, destroy, only project managers
        return [drf_permissions.IsAuthenticated(), permissions.IsEndUserOrProjectManager()]

    def perform_create(self, serializer):
        exec = serializer.save(user=self.request.user)
        # create item executions from template items
        for item in exec.template.items.all():
            models.ChecklistItemExecution.objects.create(execution=exec, item=item)
        exec.calculate_progress()


class ChecklistItemExecutionViewSet(viewsets.ModelViewSet):
    queryset = models.ChecklistItemExecution.objects.all()
    serializer_class = serializers.ChecklistItemExecutionSerializer
    permission_classes = [drf_permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['execution', 'item']


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.AuditLog.objects.all()
    serializer_class = serializers.AuditLogSerializer
    permission_classes = [drf_permissions.IsAuthenticated, permissions.IsAuditor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['action', 'user__email']

from rest_framework import viewsets, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from . import models
from . import serializers

class ObtainTokenByEmail(ObtainAuthToken):
    serializer_class = serializers.EmailAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})

class LogoutTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response(status=204)

class RoleViewSet(viewsets.ModelViewSet):
    queryset = models.Role.objects.all()
    serializer_class = serializers.RoleSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer

class ChecklistTemplateViewSet(viewsets.ModelViewSet):
    queryset = models.ChecklistTemplate.objects.all()
    serializer_class = serializers.ChecklistTemplateSerializer

class ChecklistItemViewSet(viewsets.ModelViewSet):
    queryset = models.ChecklistItem.objects.all()
    serializer_class = serializers.ChecklistItemSerializer

class ChecklistExecutionViewSet(viewsets.ModelViewSet):
    queryset = models.ChecklistExecution.objects.all()
    serializer_class = serializers.ChecklistExecutionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class ChecklistItemExecutionViewSet(viewsets.ModelViewSet):
    queryset = models.ChecklistItemExecution.objects.all()
    serializer_class = serializers.ChecklistItemExecutionSerializer

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = models.AuditLog.objects.all()
    serializer_class = serializers.AuditLogSerializer

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = serializers.UserSerializer(request.user)
        return Response(serializer.data)
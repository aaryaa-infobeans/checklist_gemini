from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'roles', views.RoleViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'templates', views.ChecklistTemplateViewSet)
router.register(r'items', views.ChecklistItemViewSet)
router.register(r'executions', views.ChecklistExecutionViewSet)
router.register(r'item-executions', views.ChecklistItemExecutionViewSet)
router.register(r'audit-logs', views.AuditLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Provide browsable API login/logout at /api/v1/auth/login/ and /api/v1/auth/logout/
    # Token login endpoint (POST email,password) -> {token: ...}
    path('auth/login/', views.ObtainTokenByEmail.as_view(), name='api-token-login'),
    # Token logout endpoint: POST with Authorization: Token <key>
    path('auth/logout/', views.LogoutTokenView.as_view(), name='api-token-logout'),
    # New endpoint for /users/me/
    # path('users/me/', views.MeView.as_view(), name='user-me'),
    # Provide browsable API login/logout at /api/v1/auth/login/ and /api/v1/auth/logout/
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
]

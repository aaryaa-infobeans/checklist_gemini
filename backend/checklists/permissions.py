from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'role', None) and request.user.role.name.lower() == 'admin')


class IsProjectManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'role', None) and request.user.role.name.lower() in ['admin', 'project manager', 'project_manager'])


class IsAuditor(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'role', None) and request.user.role.name.lower() == 'auditor')


class IsEndUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'role', None) and request.user.role.name.lower() in ['app-user', 'end_user', 'user'])


class IsEndUserOrProjectManager(permissions.BasePermission):
    """Allow if user is an end user OR a project manager (or admin)."""
    def has_permission(self, request, view):
        if not request.user or not getattr(request.user, 'role', None):
            return False
        name = request.user.role.name.lower()
        return name in ['end user', 'end_user', 'user', 'app-user', 'project_manager', 'project_manager'] or name == 'admin'


class IsOwnerOrProjectManager(permissions.BasePermission):
    """Allow access if user is owner of the object or project manager/admin."""
    def has_object_permission(self, request, view, obj):
        if not request.user or not getattr(request.user, 'role', None):
            return False
        name = request.user.role.name.lower()
        if name == 'admin' or name in ['project manager', 'project_manager']:
            return True
        # assume obj has `owner` attr
        owner = getattr(obj, 'owner', None)
        return owner is not None and owner == request.user


class IsExecutionOwnerOrManager(permissions.BasePermission):
    """Allow access if user is the user of the execution or project manager/admin."""
    def has_object_permission(self, request, view, obj):
        if not request.user or not getattr(request.user, 'role', None):
            return False
        role_name = request.user.role.name.lower()
        if role_name in ['admin', 'app-user', 'project_manager']:
            return True
        # obj is a ChecklistExecution instance
        return obj.user == request.user
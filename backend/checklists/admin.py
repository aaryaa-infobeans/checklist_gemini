from django.contrib import admin
from . import models


@admin.register(models.Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'name', 'role', 'is_staff')
    search_fields = ('email', 'name')


@admin.register(models.ChecklistTemplate)
class ChecklistTemplateAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'version', 'archived')
    list_filter = ('category', 'archived')


@admin.register(models.ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'template', 'order')


@admin.register(models.ChecklistExecution)
class ChecklistExecutionAdmin(admin.ModelAdmin):
    list_display = ('id', 'template', 'user', 'status', 'progress')
    list_filter = ('status',)


@admin.register(models.ChecklistItemExecution)
class ChecklistItemExecutionAdmin(admin.ModelAdmin):
    list_display = ('id', 'execution', 'item', 'status', 'completed_at')


@admin.register(models.AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'timestamp', 'user', 'action')

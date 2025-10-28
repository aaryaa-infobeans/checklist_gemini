from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class Role(models.Model):
    """Represents a user role with associated permissions."""
    name = models.CharField(max_length=50, unique=True)
    permissions = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    def create_user(self, email, name=None, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Represents a system user with an assigned role."""
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100,null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class ChecklistTemplate(models.Model):
    """Represents a checklist template that can be executed by users."""
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    version = models.IntegerField(default=1)
    archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    # optional owner for templates so project managers can own templates
    owner = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_templates')

    def __str__(self):
        return f"{self.title} (v{self.version})"


class ChecklistItem(models.Model):
    """Represents an individual item within a checklist template."""
    description = models.TextField()
    template = models.ForeignKey(ChecklistTemplate, on_delete=models.CASCADE, related_name='items')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Item {self.order}: {self.description[:50]}"


class ChecklistExecution(models.Model):
    """Tracks the execution of a checklist template by a user. Overall progress is calculated from individual item executions."""
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    template = models.ForeignKey(ChecklistTemplate, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    progress = models.FloatField(default=0.0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def calculate_progress(self):
        """Calculate overall progress based on related ChecklistItemExecution records."""
        total = self.item_executions.count()
        if total == 0:
            self.progress = 0.0
            self.status = 'Pending'
            self.completed_at = None
            self.save(update_fields=['progress', 'status', 'completed_at'])
            return 0.0

        completed = self.item_executions.filter(status='Completed').count()
        self.progress = (completed / total) * 100.0

        if completed == total:
            self.status = 'Completed'
            if self.completed_at is None:
                self.completed_at = timezone.now()
        else:
            self.status = 'In Progress' if completed > 0 else 'Pending'
            self.completed_at = None

        self.save(update_fields=['progress', 'status', 'completed_at'])
        return self.progress

    def __str__(self):
        return f"Execution {self.id} - {self.template.title} by {self.user.email}"


class ChecklistItemExecution(models.Model):
    """Tracks the execution status of each checklist item within a checklist execution. Allows fine-grained progress tracking per item."""
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    execution = models.ForeignKey(ChecklistExecution, on_delete=models.CASCADE, related_name='item_executions')
    item = models.ForeignKey(ChecklistItem, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # update completed_at timestamp when marked completed
        if self.status == 'Completed' and self.completed_at is None:
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)
        # after saving, recalculate parent execution progress
        try:
            self.execution.calculate_progress()
        except Exception:
            pass

    def __str__(self):
        return f"Execution {self.execution.id} - Item {self.item.id}: {self.status}"


class AuditLog(models.Model):
    """Stores audit logs for actions performed by users."""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp.isoformat()} - {self.user}: {self.action}"

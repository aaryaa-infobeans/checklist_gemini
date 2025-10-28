"""Initial migration for checklists app."""
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('permissions', models.JSONField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='checklists.role')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ChecklistTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('category', models.CharField(max_length=100)),
                ('version', models.IntegerField(default=1)),
                ('archived', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ChecklistItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('order', models.IntegerField(default=0)),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='checklists.checklisttemplate')),
            ],
        ),
        migrations.CreateModel(
            name='ChecklistExecution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Completed', 'Completed')], default='Pending', max_length=20)),
                ('progress', models.FloatField(default=0.0)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='checklists.checklisttemplate')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='checklists.user')),
            ],
        ),
        migrations.CreateModel(
            name='ChecklistItemExecution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Completed', 'Completed')], default='Pending', max_length=20)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('execution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='item_executions', to='checklists.checklistexecution')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='checklists.checklistitem')),
            ],
        ),
        migrations.CreateModel(
            name='AuditLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=255)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='checklists.user')),
            ],
        ),
    ]

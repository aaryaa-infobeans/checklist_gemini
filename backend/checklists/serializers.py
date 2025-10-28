from django.contrib.auth import authenticate
from rest_framework import serializers
from . import models

# New Serializer for email-based authentication
class EmailAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                username=email, password=password)

            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "email" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Role
        fields = ['id', 'name', 'permissions']


class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    role_name = serializers.SerializerMethodField(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(queryset=models.Role.objects.all(), source='role', write_only=True, required=False)

    class Meta:
        model = models.User
        fields = ['id', 'email', 'name', 'role', 'role_id', 'role_name']

    def get_role_name(self, obj):
        return obj.role.name if obj.role else None


class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ChecklistItem
        fields = ['id', 'description', 'order', 'template']


class ChecklistTemplateSerializer(serializers.ModelSerializer):
    items = ChecklistItemSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)

    class Meta:
        model = models.ChecklistTemplate
        fields = ['id', 'title', 'category', 'version', 'archived', 'items', 'owner']


class ChecklistItemExecutionSerializer(serializers.ModelSerializer):
    item = ChecklistItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(queryset=models.ChecklistItem.objects.all(), source='item', write_only=True)

    class Meta:
        model = models.ChecklistItemExecution
        fields = ['id', 'execution', 'item', 'item_id', 'status', 'completed_at']


class ChecklistExecutionSerializer(serializers.ModelSerializer):
    item_executions = ChecklistItemExecutionSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=models.User.objects.all(), source='user', write_only=True, required=False)
    template = ChecklistTemplateSerializer(read_only=True)
    template_id = serializers.PrimaryKeyRelatedField(queryset=models.ChecklistTemplate.objects.all(), source='template', write_only=True, required=False)

    class Meta:
        model = models.ChecklistExecution
        fields = ['id', 'user', 'user_id', 'template', 'template_id', 'status', 'progress', 'started_at', 'completed_at', 'item_executions']

    def update(self, instance, validated_data):
        item_executions_data = self.context['request'].data.get('item_executions')

        instance.status = validated_data.get('status', instance.status)
        instance.save()

        if item_executions_data:
            for item_data in item_executions_data:
                item_id = item_data.get('item')
                completed = item_data.get('completed')
                status = 'Completed' if completed else 'Pending'
                
                item_execution, created = models.ChecklistItemExecution.objects.update_or_create(
                    execution=instance,
                    item_id=item_id,
                    defaults={'status': status}
                )
        
        instance.calculate_progress()
        return instance

    def validate(self, data):
        if not self.instance: # creating
            if 'user' not in data:
                raise serializers.ValidationError({"user_id": "This field is required."})
            if 'template' not in data:
                raise serializers.ValidationError({"template_id": "This field is required."})
        return data


class AuditLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = models.AuditLog
        fields = ['id', 'user', 'action', 'timestamp']

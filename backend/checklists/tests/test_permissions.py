from django.test import TestCase
from rest_framework.test import APIRequestFactory
from checklists import models, permissions


class PermissionTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.admin_role = models.Role.objects.create(name='admin')
        self.pm_role = models.Role.objects.create(name='project_manager')
        self.app_role = models.Role.objects.create(name='app_user')
        self.auditor_role = models.Role.objects.create(name='auditor')
        self.admin = models.User.objects.create_user(email='admin@example.com', password='pass', role=self.admin_role)
        self.pm = models.User.objects.create_user(email='pm@example.com', password='pass', role=self.pm_role)
        self.app_user = models.User.objects.create_user(email='app@example.com', password='pass', role=self.app_role)
        self.auditor = models.User.objects.create_user(email='auditor@example.com', password='pass', role=self.auditor_role)
        self.template = models.ChecklistTemplate.objects.create(title='Template', category='QA', owner=self.pm)
        self.execution = models.ChecklistExecution.objects.create(user=self.app_user, template=self.template)

    def _request(self, method='get', user=None):
        if method.lower() == 'post':
            request = self.factory.post('/')
        else:
            request = self.factory.get('/')
        request.user = user
        return request

    def test_is_admin(self):
        perm = permissions.IsAdmin()
        self.assertTrue(perm.has_permission(self._request(user=self.admin), None))
        self.assertFalse(perm.has_permission(self._request(user=self.pm), None))

    def test_is_project_manager(self):
        perm = permissions.IsProjectManager()
        self.assertTrue(perm.has_permission(self._request(user=self.pm), None))
        self.assertTrue(perm.has_permission(self._request(user=self.admin), None))
        self.assertFalse(perm.has_permission(self._request(user=self.app_user), None))

    def test_is_end_user_or_project_manager_post(self):
        perm = permissions.IsEndUserOrProjectManager()
        self.assertTrue(perm.has_permission(self._request(method='post', user=self.app_user), None))

    def test_is_owner_or_project_manager(self):
        perm = permissions.IsOwnerOrProjectManager()
        self.assertTrue(perm.has_object_permission(self._request(user=self.pm), None, self.template))
        self.assertTrue(perm.has_object_permission(self._request(user=self.admin), None, self.template))
        self.assertFalse(perm.has_object_permission(self._request(user=self.app_user), None, self.template))

    def test_is_execution_owner_or_manager(self):
        perm = permissions.IsExecutionOwnerOrManager()
        self.assertTrue(perm.has_object_permission(self._request(user=self.admin), None, self.execution))
        self.assertTrue(perm.has_object_permission(self._request(user=self.app_user), None, self.execution))
        self.assertFalse(perm.has_object_permission(self._request(user=self.auditor), None, self.execution))

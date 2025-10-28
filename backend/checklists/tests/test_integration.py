from django.test import TestCase
from rest_framework.test import APIClient
from checklists.models import Role, User


class ProjectManagerIntegrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # ensure roles exist
        Role.objects.get_or_create(name='project_manager')
        Role.objects.get_or_create(name='admin')
        # create a project manager user
        self.pm = User.objects.create_user(email='pm@example.com', password='pm123')
        role = Role.objects.get(name='project_manager')
        self.pm.role = role
        self.pm.save()
        # obtain token
        resp = self.client.post('/api/v1/auth/login/', {'email': 'pm@example.com', 'password': 'pm123'}, format='json')
        self.assertEqual(resp.status_code, 200)
        token = resp.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

    def test_pm_can_create_template_item_and_execution(self):
        # create template
        resp = self.client.post('/api/v1/templates/', {'title': 'PM Test', 'category': 'QA'}, format='json')
        self.assertEqual(resp.status_code, 201)
        tpl_id = resp.data['id']
        # create item
        resp = self.client.post('/api/v1/items/', {'description': 'Do QA', 'order': 0, 'template': tpl_id}, format='json')
        self.assertEqual(resp.status_code, 201)
        # create execution
        resp = self.client.post('/api/v1/executions/', {'user_id': self.pm.id, 'template_id': tpl_id}, format='json')
        self.assertEqual(resp.status_code, 201)

from django.test import TestCase
from checklists import models


class ChecklistExecutionModelTests(TestCase):
    def setUp(self):
        self.pm_role = models.Role.objects.create(name='project_manager')
        self.admin_role = models.Role.objects.create(name='admin')
        self.pm = models.User.objects.create_user(email='pm@example.com', password='pass', role=self.pm_role)
        self.template = models.ChecklistTemplate.objects.create(title='Template', category='QA', owner=self.pm)

    def test_calculate_progress_with_no_items(self):
        execution = models.ChecklistExecution.objects.create(user=self.pm, template=self.template)
        progress = execution.calculate_progress()
        execution.refresh_from_db()
        self.assertEqual(progress, 0.0)
        self.assertEqual(execution.progress, 0.0)
        self.assertEqual(execution.status, 'Pending')
        self.assertIsNone(execution.completed_at)

    def test_calculate_progress_partial_completion(self):
        execution = models.ChecklistExecution.objects.create(user=self.pm, template=self.template)
        item_one = models.ChecklistItem.objects.create(template=self.template, description='Do thing', order=0)
        item_two = models.ChecklistItem.objects.create(template=self.template, description='Do other thing', order=1)
        models.ChecklistItemExecution.objects.create(execution=execution, item=item_one, status='Completed')
        models.ChecklistItemExecution.objects.create(execution=execution, item=item_two, status='Pending')
        execution.refresh_from_db()
        self.assertEqual(execution.progress, 50.0)
        self.assertEqual(execution.status, 'In Progress')
        self.assertIsNone(execution.completed_at)

    def test_calculate_progress_all_items_completed(self):
        execution = models.ChecklistExecution.objects.create(user=self.pm, template=self.template)
        item = models.ChecklistItem.objects.create(template=self.template, description='Finish task', order=0)
        models.ChecklistItemExecution.objects.create(execution=execution, item=item, status='Completed')
        execution.refresh_from_db()
        self.assertEqual(execution.progress, 100.0)
        self.assertEqual(execution.status, 'Completed')
        self.assertIsNotNone(execution.completed_at)

    def test_item_execution_save_sets_completed_timestamp(self):
        execution = models.ChecklistExecution.objects.create(user=self.pm, template=self.template)
        item = models.ChecklistItem.objects.create(template=self.template, description='Finish task', order=0)
        item_execution = models.ChecklistItemExecution(execution=execution, item=item, status='Completed')
        self.assertIsNone(item_execution.completed_at)
        item_execution.save()
        item_execution.refresh_from_db()
        execution.refresh_from_db()
        self.assertIsNotNone(item_execution.completed_at)
        self.assertEqual(execution.progress, 100.0)
        self.assertEqual(execution.status, 'Completed')

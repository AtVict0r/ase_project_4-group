from django.core.management.base import BaseCommand
import subprocess
import os

class Command(BaseCommand):
    help = 'Starts the frontend server along with the Django server.'

    def handle(self, *args, **options):
        frontend_path = os.path.normpath(os.path.join(os.getcwd(), '..', 'frontend'))
        self.stdout.write(self.style.SUCCESS(f'Attempting to start frontend in: {frontend_path}'))

        # Specify the full path to npm
        npm_path = "C:\\Program Files\\nodejs\\npm.cmd"  # Update this path based on where npm is installed on your system
        react_command = [npm_path, "start"]

        try:
            # Start the React frontend
            self.stdout.write(self.style.SUCCESS('Starting the frontend server...'))
            react_process = subprocess.Popen(react_command, cwd=frontend_path, shell=True)
            self.stdout.write(self.style.SUCCESS(f'Frontend started, PID: {react_process.pid}'))

            # Start the Django backend
            self.stdout.write(self.style.SUCCESS('Starting the Django server...'))
            django_command = ["python", "manage.py", "runserver"]
            django_process = subprocess.Popen(django_command)
            self.stdout.write(self.style.SUCCESS(f'Django started, PID: {django_process.pid}'))

            # Wait for the React process to complete
            react_process.wait()
            # Optionally, handle Django separately if React exits
            if react_process.returncode != 0:
                self.stdout.write(self.style.ERROR('Frontend server exited unexpectedly.'))
                # Consider whether to terminate Django or not
                # django_process.terminate()

            # Wait for the Django process if it's still running
            if django_process.poll() is None:
                django_process.wait()

        except FileNotFoundError as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}. Check if the command is correct and executable is available.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An unexpected error occurred: {e}'))

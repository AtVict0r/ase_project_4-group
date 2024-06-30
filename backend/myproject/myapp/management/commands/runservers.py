from django.core.management.base import BaseCommand
import subprocess
import os
import signal
import sys

class Command(BaseCommand):
    help = 'Starts the frontend server along with the Django server.'

    def handle(self, *args, **options):
        frontend_path = os.path.normpath(os.path.join(os.getcwd(), '..', 'frontend'))
        self.stdout.write(self.style.SUCCESS(f'Attempting to start frontend in: {frontend_path}'))

        react_command = ["npm", "start"]

        def handle_exit(signum, frame):
            self.stdout.write('Terminating servers...')
            if react_process:
                react_process.terminate()
            if django_process:
                django_process.terminate()
            sys.exit(0)

        signal.signal(signal.SIGINT, handle_exit)
        signal.signal(signal.SIGTERM, handle_exit)

        try:
            # Start the React frontend
            self.stdout.write(self.style.SUCCESS('Starting the frontend server...'))
            react_process = subprocess.Popen(react_command, cwd=frontend_path)
            self.stdout.write(self.style.SUCCESS(f'Frontend started, PID: {react_process.pid}'))

            # Start the Django backend
            self.stdout.write(self.style.SUCCESS('Starting the Django server...'))
            django_command = ["python", "manage.py", "runserver"]
            django_process = subprocess.Popen(django_command)
            self.stdout.write(self.style.SUCCESS(f'Django started, PID: {django_process.pid}'))

            # Monitor processes
            while True:
                if react_process.poll() is not None:
                    self.stdout.write(self.style.ERROR('Frontend server exited unexpectedly.'))
                    break
                if django_process.poll() is not None:
                    self.stdout.write(self.style.ERROR('Django server exited unexpectedly.'))
                    break

        except FileNotFoundError as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}. Check if the command is correct and executable is available.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An unexpected error occurred: {e}'))

if __name__ == "__main__":
    Command().handle()

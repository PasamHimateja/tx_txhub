import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Institute.settings')
django.setup()

from App.models import Trainer

def create_trainer(force_reset=False):
    email = "trainer@txhub.com"
    
    existing = Trainer.objects.filter(email=email).first()
    
    if existing:
        if force_reset:
            existing.delete()
            print(f"Deleted existing trainer: {email}")
        else:
            # Ensure password is correctly set even for existing account
            existing.set_password("password123")
            existing.is_active = True
            existing.save()
            print(f"Trainer already exists — password reset to: password123")
            print(f"  Email: {existing.email}")
            print(f"  Name:  {existing.name}")
            print(f"  Course: {existing.assigned_course}")
            return
    
    trainer = Trainer(
        name="John Doe",
        email=email,
        assigned_course="Python Full Stack",
        is_active=True
    )
    trainer.set_password("password123")
    trainer.save()
    print(f"Trainer created successfully!")
    print(f"  Email:    {trainer.email}")
    print(f"  Password: password123")
    print(f"  Course:   {trainer.assigned_course}")

if __name__ == "__main__":
    import sys
    force = "--reset" in sys.argv
    create_trainer(force_reset=force)

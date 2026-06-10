import os
import django
import sys
 
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Institute.settings')
django.setup()
 
from App.models import Trainer
 
 
def list_trainers():
    trainers = Trainer.objects.all()
    if not trainers:
        print("No trainers found in the database.")
        return
    print(f"\n{'-' * 60}")
    print(f"  {'#':<4} {'Name':<20} {'Email':<30} {'Course'}")
    print(f"{'-' * 60}")
    for i, t in enumerate(trainers, 1):
        print(f"  {i:<4} {t.name:<20} {t.email:<30} {t.assigned_course}")
    print(f"{'-' * 60}\n")
 
 
def add_trainer():
    print("\n-- Add New Trainer ------------------------------")
    name   = input("  Name           : ").strip()
    email  = input("  Email          : ").strip()
    course = input("  Assigned Course: ").strip()
    password = input("  Password (leave blank for 'password123'): ").strip() or "password123"
 
    if not name or not email or not course:
        print("❌ Name, email, and course are required.")
        return
 
    existing = Trainer.objects.filter(email=email).first()
    if existing:
        existing.set_password(password)
        existing.name = name
        existing.assigned_course = course
        existing.is_active = True
        existing.save()
        print(f"\n✅ Trainer already existed — updated successfully!")
    else:
        trainer = Trainer(name=name, email=email, assigned_course=course, is_active=True)
        trainer.set_password(password)
        trainer.save()
        print(f"\n✅ Trainer created successfully!")
 
    print(f"   Email:    {email}")
    print(f"   Password: {password}")
    print(f"   Course:   {course}\n")
 
 
def reset_trainer(email):
    trainer = Trainer.objects.filter(email=email).first()
    if not trainer:
        print(f"❌ No trainer found with email: {email}")
        return
    new_password = input(f"  New password for {email} (leave blank for 'password123'): ").strip() or "password123"
    trainer.set_password(new_password)
    trainer.is_active = True
    trainer.save()
    print(f"✅ Password reset for {trainer.name} ({email}) → {new_password}\n")
 
 
def delete_trainer(email):
    trainer = Trainer.objects.filter(email=email).first()
    if not trainer:
        print(f"❌ No trainer found with email: {email}")
        return
    confirm = input(f"  Delete '{trainer.name}' ({email})? [y/N]: ").strip().lower()
    if confirm == 'y':
        trainer.delete()
        print(f"✅ Trainer '{trainer.name}' deleted.\n")
    else:
        print("Cancelled.")
 
 
if __name__ == "__main__":
    args = sys.argv[1:]
 
    if not args:
        list_trainers()
    elif args[0] == "add":
        add_trainer()
    elif args[0] == "reset" and len(args) == 2:
        reset_trainer(args[1])
    elif args[0] == "delete" and len(args) == 2:
        delete_trainer(args[1])
    else:
        print(__doc__)
import requests
import sys
from datetime import datetime, date
import json

class WorkHoursAPITester:
    def __init__(self, base_url="https://hourly-tracker-9.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.admin_token = None
        self.employee_token = None
        self.employee_id = None
        self.time_entry_id = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response text: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@company.com", "password": "admin123"}
        )
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"Admin user: {response['user']['full_name']} ({response['user']['role']})")
            return True
        return False

    def test_create_employee(self):
        """Test creating a new employee"""
        employee_data = {
            "email": f"test_employee_{datetime.now().strftime('%H%M%S')}@company.com",
            "password": "employee123",
            "full_name": "Тестовий Працівник",
            "position": "Розробник",
            "hourly_rate": 250.0,
            "role": "employee"
        }
        
        success, response = self.run_test(
            "Create Employee",
            "POST",
            "auth/register",
            200,
            data=employee_data,
            token=self.admin_token
        )
        if success and 'id' in response:
            self.employee_id = response['id']
            self.employee_email = employee_data['email']
            self.employee_password = employee_data['password']
            print(f"Created employee: {response['full_name']} (ID: {self.employee_id})")
            return True
        return False

    def test_employee_login(self):
        """Test employee login"""
        success, response = self.run_test(
            "Employee Login",
            "POST",
            "auth/login",
            200,
            data={"email": self.employee_email, "password": self.employee_password}
        )
        if success and 'access_token' in response:
            self.employee_token = response['access_token']
            print(f"Employee logged in: {response['user']['full_name']}")
            return True
        return False

    def test_get_users(self):
        """Test getting all users (admin only)"""
        success, response = self.run_test(
            "Get All Users",
            "GET",
            "users",
            200,
            token=self.admin_token
        )
        if success and isinstance(response, list):
            print(f"Found {len(response)} users")
            return True
        return False

    def test_update_employee(self):
        """Test updating employee data"""
        update_data = {
            "position": "Старший Розробник",
            "hourly_rate": 300.0
        }
        
        success, response = self.run_test(
            "Update Employee",
            "PUT",
            f"users/{self.employee_id}",
            200,
            data=update_data,
            token=self.admin_token
        )
        if success:
            print(f"Updated employee position: {response.get('position')}, rate: {response.get('hourly_rate')}")
            return True
        return False

    def test_create_time_entry(self):
        """Test creating a time entry"""
        entry_data = {
            "date": date.today().strftime("%Y-%m-%d"),
            "hours": 8.0,
            "description": "Тестова робота"
        }
        
        success, response = self.run_test(
            "Create Time Entry",
            "POST",
            "time-entries",
            200,
            data=entry_data,
            token=self.employee_token
        )
        if success and 'id' in response:
            self.time_entry_id = response['id']
            print(f"Created time entry: {response['hours']} hours on {response['date']}")
            return True
        return False

    def test_get_time_entries(self):
        """Test getting time entries"""
        success, response = self.run_test(
            "Get Time Entries (Employee)",
            "GET",
            "time-entries",
            200,
            token=self.employee_token
        )
        if success and isinstance(response, list):
            print(f"Employee has {len(response)} time entries")
            return True
        return False

    def test_get_all_time_entries_admin(self):
        """Test admin getting all time entries"""
        success, response = self.run_test(
            "Get All Time Entries (Admin)",
            "GET",
            "time-entries",
            200,
            token=self.admin_token
        )
        if success and isinstance(response, list):
            print(f"Admin sees {len(response)} total time entries")
            return True
        return False

    def test_update_time_entry(self):
        """Test updating a time entry"""
        update_data = {
            "hours": 7.5,
            "description": "Оновлена тестова робота"
        }
        
        success, response = self.run_test(
            "Update Time Entry",
            "PUT",
            f"time-entries/{self.time_entry_id}",
            200,
            data=update_data,
            token=self.employee_token
        )
        if success:
            print(f"Updated time entry: {response.get('hours')} hours")
            return True
        return False

    def test_salary_report(self):
        """Test salary report generation"""
        success, response = self.run_test(
            "Salary Report",
            "GET",
            "reports/salary",
            200,
            token=self.admin_token
        )
        if success and isinstance(response, list):
            print(f"Salary report has {len(response)} entries")
            for report in response:
                print(f"  - {report.get('user_name')}: {report.get('total_hours')} hrs = {report.get('total_salary')} грн")
            return True
        return False

    def test_delete_time_entry(self):
        """Test deleting a time entry"""
        success, response = self.run_test(
            "Delete Time Entry",
            "DELETE",
            f"time-entries/{self.time_entry_id}",
            200,
            token=self.employee_token
        )
        return success

    def test_delete_employee(self):
        """Test deleting an employee"""
        success, response = self.run_test(
            "Delete Employee",
            "DELETE",
            f"users/{self.employee_id}",
            200,
            token=self.admin_token
        )
        return success

    def test_auth_me(self):
        """Test getting current user info"""
        success, response = self.run_test(
            "Get Current User Info",
            "GET",
            "auth/me",
            200,
            token=self.employee_token
        )
        if success:
            print(f"Current user: {response.get('full_name')} ({response.get('role')})")
            return True
        return False

def main():
    print("🚀 Starting Work Hours API Testing...")
    tester = WorkHoursAPITester()

    # Test sequence
    tests = [
        ("Admin Login", tester.test_admin_login),
        ("Create Employee", tester.test_create_employee),
        ("Employee Login", tester.test_employee_login),
        ("Get Current User Info", tester.test_auth_me),
        ("Get All Users", tester.test_get_users),
        ("Update Employee", tester.test_update_employee),
        ("Create Time Entry", tester.test_create_time_entry),
        ("Get Time Entries (Employee)", tester.test_get_time_entries),
        ("Get All Time Entries (Admin)", tester.test_get_all_time_entries_admin),
        ("Update Time Entry", tester.test_update_time_entry),
        ("Salary Report", tester.test_salary_report),
        ("Delete Time Entry", tester.test_delete_time_entry),
        ("Delete Employee", tester.test_delete_employee),
    ]

    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            failed_tests.append(test_name)

    # Print final results
    print(f"\n📊 Final Results:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed tests: {', '.join(failed_tests)}")
        return 1
    else:
        print(f"\n✅ All tests passed!")
        return 0

if __name__ == "__main__":
    sys.exit(main())
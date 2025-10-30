export const translations = {
  uk: {
    // Login
    loginTitle: "Облік робочих годин",
    loginSubtitle: "Увійдіть до системи обліку часу",
    email: "Email",
    password: "Пароль",
    loginButton: "Увійти",
    loading: "Завантаження...",
    adminCredentials: "Адмін: admin@company.com / admin123",
    
    // Common
    logout: "Вийти",
    save: "Зберегти",
    update: "Оновити",
    create: "Створити",
    cancel: "Скасувати",
    delete: "Видалити",
    edit: "Редагувати",
    add: "Додати",
    
    // Dashboard
    totalHours: "Всього годин",
    hourlyRate: "Годинна ставка",
    totalSalary: "Всього до виплати",
    myEntries: "Мої записи",
    noEntries: "Немає записів",
    
    // Employee Dashboard
    employeeDashboard: "Панель працівника",
    addEntry: "Додати запис",
    addEntryTitle: "Додати запис",
    editEntryTitle: "Редагувати запис",
    entryDescription: "Заповніть дані про відпрацьовані години",
    date: "Дата",
    hours: "Години",
    description: "Опис (необов'язково)",
    deleteEntryConfirm: "Видалити цей запис?",
    
    // Admin Dashboard
    adminPanel: "Панель адміністратора",
    employees: "Працівники",
    totalEmployees: "Працівників",
    allTimeEntries: "Записи годин",
    salaryReport: "Звіт по зарплаті",
    addEmployee: "Додати працівника",
    addEmployeeTitle: "Додати працівника",
    editEmployeeTitle: "Редагувати працівника",
    employeeDescription: "Заповніть дані про працівника",
    fullName: "Повне ім'я",
    position: "Посада",
    hourlyRateInput: "Годинна ставка (PLN)",
    hourlyRateDelegacja: "Ставка для відрядження (PLN)",
    passwordOptional: "Пароль (залиште порожнім, якщо не змінюєте)",
    deleteEmployeeConfirm: "Видалити цього користувача? Це також видалить всі його записи.",
    noEmployees: "Немає працівників",
    allEntries: "Всі записи годин",
    
    // Toast messages
    loginSuccess: "Успішний вхід!",
    loginError: "Помилка входу",
    entryAdded: "Запис додано!",
    entryUpdated: "Запис оновлено!",
    entryDeleted: "Запис видалено",
    entryError: "Помилка збереження",
    deleteError: "Помилка видалення",
    loadError: "Помилка завантаження даних",
    employeeCreated: "Користувача створено!",
    employeeUpdated: "Користувача оновлено!",
    employeeDeleted: "Користувача видалено",
    
    // Currency
    currency: "PLN",
    perHour: "PLN/год",
    delegacja: "відрядження",
    regularHours: "Звичайні години",
    delegacjaHours: "Години відрядження",
  },
  
  pl: {
    // Login
    loginTitle: "Ewidencja czasu pracy",
    loginSubtitle: "Zaloguj się do systemu ewidencji czasu",
    email: "Email",
    password: "Hasło",
    loginButton: "Zaloguj się",
    loading: "Ładowanie...",
    adminCredentials: "Admin: admin@company.com / admin123",
    
    // Common
    logout: "Wyloguj",
    save: "Zapisz",
    update: "Aktualizuj",
    create: "Utwórz",
    cancel: "Anuluj",
    delete: "Usuń",
    edit: "Edytuj",
    add: "Dodaj",
    
    // Dashboard
    totalHours: "Suma godzin",
    hourlyRate: "Stawka godzinowa",
    totalSalary: "Całkowite wynagrodzenie",
    myEntries: "Moje wpisy",
    noEntries: "Brak wpisów",
    
    // Employee Dashboard
    employeeDashboard: "Panel pracownika",
    addEntry: "Dodaj wpis",
    addEntryTitle: "Dodaj wpis",
    editEntryTitle: "Edytuj wpis",
    entryDescription: "Wypełnij dane o przepracowanych godzinach",
    date: "Data",
    hours: "Godziny",
    description: "Opis (opcjonalnie)",
    deleteEntryConfirm: "Usunąć ten wpis?",
    
    // Admin Dashboard
    adminPanel: "Panel administratora",
    employees: "Pracownicy",
    totalEmployees: "Pracowników",
    allTimeEntries: "Wpisy godzin",
    salaryReport: "Raport wynagrodzeń",
    addEmployee: "Dodaj pracownika",
    addEmployeeTitle: "Dodaj pracownika",
    editEmployeeTitle: "Edytuj pracownika",
    employeeDescription: "Wypełnij dane o pracowniku",
    fullName: "Imię i nazwisko",
    position: "Stanowisko",
    hourlyRateInput: "Stawka godzinowa (PLN)",
    hourlyRateDelegacja: "Stawka dla delegacji (PLN)",
    passwordOptional: "Hasło (pozostaw puste, jeśli nie zmieniasz)",
    deleteEmployeeConfirm: "Usunąć tego użytkownika? Spowoduje to również usunięcie wszystkich jego wpisów.",
    noEmployees: "Brak pracowników",
    allEntries: "Wszystkie wpisy godzin",
    
    // Toast messages
    loginSuccess: "Pomyślnie zalogowano!",
    loginError: "Błąd logowania",
    entryAdded: "Wpis dodany!",
    entryUpdated: "Wpis zaktualizowany!",
    entryDeleted: "Wpis usunięty",
    entryError: "Błąd zapisu",
    deleteError: "Błąd usuwania",
    loadError: "Błąd ładowania danych",
    employeeCreated: "Użytkownik utworzony!",
    employeeUpdated: "Użytkownik zaktualizowany!",
    employeeDeleted: "Użytkownik usunięty",
    
    // Currency
    currency: "PLN",
    perHour: "PLN/godz",
  }
};

export const getTranslation = (lang, key) => {
  return translations[lang]?.[key] || translations['uk'][key] || key;
};
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, LogOut, Plus, Edit, Trash2, Users, DollarSign, Briefcase, Languages } from "lucide-react";
import { format } from "date-fns";
import { uk, pl } from "date-fns/locale";
import { useLanguage } from "@/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ user, onLogout }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const [users, setUsers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [salaryReport, setSalaryReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    position: "",
    hourly_rate: "",
    hourly_rate_delegacja: "",
    role: "employee",
  });
  
  const dateLocale = language === 'uk' ? uk : pl;

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, entriesRes, salaryRes] = await Promise.all([
        axios.get(`${API}/users`, axiosConfig),
        axios.get(`${API}/time-entries`, axiosConfig),
        axios.get(`${API}/reports/salary`, axiosConfig),
      ]);

      setUsers(usersRes.data);
      setEntries(entriesRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setSalaryReport(salaryRes.data);
    } catch (error) {
      toast.error(t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const updateData = {
          full_name: userFormData.full_name,
          position: userFormData.position,
          hourly_rate: parseFloat(userFormData.hourly_rate),
          hourly_rate_delegacja: parseFloat(userFormData.hourly_rate_delegacja || 0),
        };
        if (userFormData.password) {
          updateData.password = userFormData.password;
        }
        await axios.put(`${API}/users/${editingUser.id}`, updateData, axiosConfig);
        toast.success(t('employeeUpdated'));
      } else {
        await axios.post(`${API}/auth/register`, {
          ...userFormData,
          hourly_rate: parseFloat(userFormData.hourly_rate),
          hourly_rate_delegacja: parseFloat(userFormData.hourly_rate_delegacja || 0),
        }, axiosConfig);
        toast.success(t('employeeCreated'));
      }

      setIsUserDialogOpen(false);
      setEditingUser(null);
      setUserFormData({
        email: "",
        password: "",
        full_name: "",
        position: "",
        hourly_rate: "",
        hourly_rate_delegacja: "",
        role: "employee",
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('entryError'));
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      email: user.email,
      password: "",
      full_name: user.full_name,
      position: user.position,
      hourly_rate: user.hourly_rate.toString(),
      hourly_rate_delegacja: (user.hourly_rate_delegacja || 0).toString(),
      role: user.role,
    });
    setIsUserDialogOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(t('deleteEmployeeConfirm'))) return;

    try {
      await axios.delete(`${API}/users/${id}`, axiosConfig);
      toast.success(t('employeeDeleted'));
      fetchData();
    } catch (error) {
      toast.error(t('deleteError'));
    }
  };

  const totalEmployees = users.filter(u => u.role === "employee").length;
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalSalary = salaryReport.reduce((sum, report) => sum + report.total_salary, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {t('adminPanel')}
              </h1>
              <p className="text-sm text-gray-400">{user.full_name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              data-testid="language-toggle-admin"
            >
              <Languages className="w-4 h-4 mr-2" />
              {language === 'uk' ? 'PL' : 'UA'}
            </Button>
            <Button
              data-testid="admin-logout-button"
              onClick={onLogout}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400">{t('totalEmployees')}</CardDescription>
                  <CardTitle className="text-3xl text-white" data-testid="total-employees">{totalEmployees}</CardTitle>
                </div>
                <Users className="w-12 h-12 text-emerald-500/30" />
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400">{t('totalHours')}</CardDescription>
                  <CardTitle className="text-3xl text-white" data-testid="admin-total-hours">{totalHours.toFixed(2)}</CardTitle>
                </div>
                <Clock className="w-12 h-12 text-emerald-500/30" />
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/20 to-gray-900 border-emerald-800/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400">{t('totalSalary')}</CardDescription>
                  <CardTitle className="text-3xl text-emerald-400" data-testid="admin-total-salary">{totalSalary.toFixed(2)} {t('currency')}</CardTitle>
                </div>
                <DollarSign className="w-12 h-12 text-emerald-500/50" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="bg-gray-900/80 border border-gray-800">
            <TabsTrigger value="employees" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              {t('employees')}
            </TabsTrigger>
            <TabsTrigger value="entries" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              {t('allTimeEntries')}
            </TabsTrigger>
            <TabsTrigger value="salary" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              {t('salaryReport')}
            </TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <div className="mb-6">
              <Dialog open={isUserDialogOpen} onOpenChange={(open) => {
                setIsUserDialogOpen(open);
                if (!open) {
                  setEditingUser(null);
                  setUserFormData({
                    email: "",
                    password: "",
                    full_name: "",
                    position: "",
                    hourly_rate: "",
                    role: "employee",
                  });
                }
              }}>
                <DialogTrigger asChild>
                  <Button
                    data-testid="add-employee-button"
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('addEmployee')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {editingUser ? t('editEmployeeTitle') : t('addEmployeeTitle')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {t('employeeDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">{t('email')}</Label>
                      <Input
                        id="email"
                        data-testid="user-email-input"
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        required={!editingUser}
                        disabled={!!editingUser}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">
                        {editingUser ? t('passwordOptional') : t('password')}
                      </Label>
                      <Input
                        id="password"
                        data-testid="user-password-input"
                        type="password"
                        value={userFormData.password}
                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                        required={!editingUser}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-gray-300">{t('fullName')}</Label>
                      <Input
                        id="full_name"
                        data-testid="user-fullname-input"
                        value={userFormData.full_name}
                        onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-gray-300">{t('position')}</Label>
                      <Input
                        id="position"
                        data-testid="user-position-input"
                        value={userFormData.position}
                        onChange={(e) => setUserFormData({ ...userFormData, position: e.target.value })}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourly_rate" className="text-gray-300">{t('hourlyRateInput')}</Label>
                      <Input
                        id="hourly_rate"
                        data-testid="user-hourly-rate-input"
                        type="number"
                        step="0.01"
                        min="0"
                        value={userFormData.hourly_rate}
                        onChange={(e) => setUserFormData({ ...userFormData, hourly_rate: e.target.value })}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <Button
                      data-testid="save-employee-button"
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                    >
                      {editingUser ? t('update') : t('create')}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-gray-900/80 border-gray-800">
              <CardContent className="pt-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-400">{t('loading')}</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">{t('noEmployees')}</div>
                ) : (
                  <div className="space-y-3">
                    {users.map((emp) => (
                      <div
                        key={emp.id}
                        data-testid={`employee-${emp.id}`}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-semibold text-white">{emp.full_name}</div>
                            <div className="px-3 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded-full text-xs text-emerald-400 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {emp.position}
                            </div>
                            {emp.role === "admin" && (
                              <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full text-xs text-white font-semibold">
                                ADMIN
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {emp.email} • {emp.hourly_rate} {t('perHour')}
                          </div>
                        </div>
                        {emp.role !== "admin" && (
                          <div className="flex gap-2">
                            <Button
                              data-testid={`edit-employee-${emp.id}`}
                              onClick={() => handleEditUser(emp)}
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              data-testid={`delete-employee-${emp.id}`}
                              onClick={() => handleDeleteUser(emp.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-900 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Entries Tab */}
          <TabsContent value="entries">
            <Card className="bg-gray-900/80 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t('allEntries')}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-400">{t('loading')}</div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">{t('noEntries')}</div>
                ) : (
                  <div className="space-y-3">
                    {entries.map((entry) => {
                      const entryUser = users.find(u => u.id === entry.user_id);
                      return (
                        <div
                          key={entry.id}
                          data-testid={`admin-entry-${entry.id}`}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-gray-400">
                                {format(new Date(entry.date), "d MMMM yyyy", { locale: dateLocale })}
                              </div>
                              <div className="text-lg font-semibold text-emerald-400">
                                {entry.hours} {language === 'uk' ? 'год' : 'godz'}
                              </div>
                              <div className="text-sm text-gray-300">
                                • {entryUser?.full_name}
                              </div>
                            </div>
                            {entry.description && (
                              <div className="text-sm text-gray-400 mt-1">{entry.description}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Salary Tab */}
          <TabsContent value="salary">
            <Card className="bg-gray-900/80 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t('salaryReport')}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-400">{t('loading')}</div>
                ) : salaryReport.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">{t('noEntries')}</div>
                ) : (
                  <div className="space-y-3">
                    {salaryReport.map((report) => (
                      <div
                        key={report.user_id}
                        data-testid={`salary-report-${report.user_id}`}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-semibold text-white">{report.user_name}</div>
                            <div className="px-3 py-1 bg-emerald-900/30 border border-emerald-700/50 rounded-full text-xs text-emerald-400 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {report.position}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {report.total_hours.toFixed(2)} {language === 'uk' ? 'год' : 'godz'} × {report.hourly_rate} {t('perHour')}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {report.total_salary.toFixed(2)} {t('currency')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

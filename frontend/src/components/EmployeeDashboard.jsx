import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, LogOut, Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EmployeeDashboard = ({ user, onLogout }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    hours: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API}/time-entries`, axiosConfig);
      setEntries(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      toast.error("Помилка завантаження записів");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEntry) {
        await axios.put(`${API}/time-entries/${editingEntry.id}`, formData, axiosConfig);
        toast.success("Запис оновлено!");
      } else {
        await axios.post(`${API}/time-entries`, formData, axiosConfig);
        toast.success("Запис додано!");
      }

      setIsDialogOpen(false);
      setEditingEntry(null);
      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        hours: "",
        description: "",
      });
      fetchEntries();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Помилка збереження");
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      hours: entry.hours.toString(),
      description: entry.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити цей запис?")) return;

    try {
      await axios.delete(`${API}/time-entries/${id}`, axiosConfig);
      toast.success("Запис видалено");
      fetchEntries();
    } catch (error) {
      toast.error("Помилка видалення");
    }
  };

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalSalary = totalHours * user.hourly_rate;

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
                {user.full_name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Briefcase className="w-4 h-4" />
                <span>{user.position}</span>
              </div>
            </div>
          </div>
          <Button
            data-testid="logout-button"
            onClick={onLogout}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardHeader>
              <CardDescription className="text-gray-400">Всього годин</CardDescription>
              <CardTitle className="text-3xl text-emerald-400" data-testid="total-hours">{totalHours.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardHeader>
              <CardDescription className="text-gray-400">Годинна ставка</CardDescription>
              <CardTitle className="text-3xl text-white">{user.hourly_rate} грн</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/20 to-gray-900 border-emerald-800/50">
            <CardHeader>
              <CardDescription className="text-gray-400">Всього до виплати</CardDescription>
              <CardTitle className="text-3xl text-emerald-400" data-testid="total-salary">{totalSalary.toFixed(2)} грн</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Add Entry Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingEntry(null);
              setFormData({
                date: format(new Date(), "yyyy-MM-dd"),
                hours: "",
                description: "",
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button
                data-testid="add-entry-button"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Додати запис
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {editingEntry ? "Редагувати запис" : "Додати запис"}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Заповніть дані про відпрацьовані години
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-300">Дата</Label>
                  <Input
                    id="date"
                    data-testid="entry-date-input"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    max={format(new Date(), "yyyy-MM-dd")}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours" className="text-gray-300">Години</Label>
                  <Input
                    id="hours"
                    data-testid="entry-hours-input"
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Опис (необов'язково)</Label>
                  <Textarea
                    id="description"
                    data-testid="entry-description-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    rows="3"
                  />
                </div>
                <Button
                  data-testid="save-entry-button"
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                >
                  {editingEntry ? "Оновити" : "Зберегти"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Entries List */}
        <Card className="bg-gray-900/80 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Мої записи</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Завантаження...</div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Немає записів</div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    data-testid={`entry-${entry.id}`}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-400">
                          {format(new Date(entry.date), "d MMMM yyyy", { locale: uk })}
                        </div>
                        <div className="text-lg font-semibold text-emerald-400">
                          {entry.hours} год
                        </div>
                      </div>
                      {entry.description && (
                        <div className="text-sm text-gray-400 mt-1">{entry.description}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        data-testid={`edit-entry-${entry.id}`}
                        onClick={() => handleEdit(entry)}
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        data-testid={`delete-entry-${entry.id}`}
                        onClick={() => handleDelete(entry.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-900 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
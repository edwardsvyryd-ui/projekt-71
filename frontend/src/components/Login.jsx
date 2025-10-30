import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Lock, Mail, Languages } from "lucide-react";
import { useLanguage } from "@/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Login = ({ onLogin }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      toast.success(t('loginSuccess'));
      onLogin(response.data.user, response.data.access_token);
    } catch (error) {
      toast.error(error.response?.data?.detail || t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-gray-900/90 backdrop-blur-xl border-gray-800">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Облік робочих годин
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Увійдіть до системи обліку часу
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  data-testid="login-email-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Пароль
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  data-testid="login-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <Button
              data-testid="login-submit-button"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-6 shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02]"
            >
              {loading ? "Завантаження..." : "Увійти"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              Адмін: admin@company.com / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
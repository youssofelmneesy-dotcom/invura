import { Link } from "react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-extrabold mb-4">INVURA</h3>
            <p className="text-gray-400 mb-4">
              ملابسك الرياضية المفضلة للتدريب والحياة اليومية
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-red-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-red-500 transition-colors">
                  المنتجات
                </Link>
              </li>
              {/* Outfit Builder disabled per request */}
              {/*
              <li>
                <Link to="/outfit-builder" className="text-gray-400 hover:text-red-500 transition-colors">
                  منشئ الأزياء
                </Link>
              </li>
              */}
              <li>
                <Link to="/user" className="text-gray-400 hover:text-red-500 transition-colors">
                  حسابي
                </Link>
              </li>
            </ul>
          </div>

          {/* خدمة العملاء */}
          <div>
            <h4 className="font-bold mb-4">خدمة العملاء</h4>
            <ul className="space-y-2 text-gray-400">
              <li>سياسة الإرجاع</li>
              <li>الشحن والتوصيل</li>
              <li>الأسئلة الشائعة</li>
              <li>اتصل بنا</li>
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@invura.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2026 INVURA. جميع الحقوق محفوظة
          </p>
          <p className="text-gray-500 mt-2">
            تم تصميم الموقع بواسطة{" "}
            <span className="text-red-500 font-bold">Sysout Company</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

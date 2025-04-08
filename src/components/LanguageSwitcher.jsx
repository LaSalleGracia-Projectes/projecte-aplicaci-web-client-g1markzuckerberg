"use client";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();

  const changeLanguage = (lang) => {
    router.push(`/${lang}`);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => changeLanguage("es")} className="p-2 bg-blue-500 text-white">🇪🇸 Español</button>
      <button onClick={() => changeLanguage("en")} className="p-2 bg-green-500 text-white">🇬🇧 English</button>
    </div>
  );
}

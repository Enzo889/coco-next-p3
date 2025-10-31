"use client";
import { api } from "@/app/api/service";
import { INCategory } from "@/types/category.interface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function InterestPage() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<INCategory[] | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        if (mounted) setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div>
        <p>loading ...</p>
      </div>
    );
  }

  return (
    <div>
      <p>{session?.user.name}</p>
      <p>
        categories:{" "}
        {loadingCategories
          ? "loading..."
          : categories && categories.length
          ? categories.map((c: INCategory, i: number) => (
              <span key={c.idCategory ?? c.idCategory ?? c.name ?? i}>
                {c.name}
                {i < categories.length - 1 ? ", " : ""}
              </span>
            ))
          : "no categories"}
      </p>
    </div>
  );
}
export default InterestPage;

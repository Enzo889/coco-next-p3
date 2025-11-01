"use client";

import type React from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { INCategory } from "@/types/category.interface";
import type { IPetition } from "@/types/petition.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/app/api/service";

interface CreatePetitionFormProps {
  categories: INCategory[];
  onSuccess: () => void;
}

export default function CreatePetitionForm({
  categories,
  onSuccess,
}: CreatePetitionFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    selectedCategory: "",
    dateSince: "",
    dateUntil: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, selectedCategory: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.selectedCategory) {
      toast.error("Error", {
        description: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    try {
      setLoading(true);

      // Crear la petición
      const newPetition: IPetition = {
        idTypePetition: 3,
        description: formData.description,
        dateSince: formData.dateSince || null,
        dateUntil: formData.dateUntil || null,
        idUserCreate: session?.user?.id || 0,
        idUserUpdate: session?.user?.id || 0,
        idState: 1, // Activa
        idCustomer: session?.user?.id || 0,
        idCategory: parseInt(formData.selectedCategory),
      };

      console.log("Petition data being sent:", newPetition);
      const createdPetition = await api.createPetition(newPetition);

      // Enviar notificaciones a usuarios con este interés
      await notifyInterestedUsers(
        Number.parseInt(formData.selectedCategory),
        createdPetition
      );

      toast.success("Exito", {
        description: "Petición creada y notificaciones enviadas",
      });

      // Resetear formulario
      setFormData({
        description: "",
        selectedCategory: "",
        dateSince: "",
        dateUntil: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error creating petition:", error);
      toast.error("Error", {
        description: "No se pudo crear la petición",
      });
    } finally {
      setLoading(false);
    }
  };

  const notifyInterestedUsers = async (
    categoryId: number,
    petition: IPetition
  ) => {
    try {
      // Obtener usuarios interesados en esta categoría
      const userInterests = await api.getUserInterests();
      const interestedUserIds = userInterests
        .filter(
          (ui) =>
            ui.idCategory === categoryId && ui.idUser !== session?.user?.id
        )
        .map((ui) => ui.idUser);

      // Crear notificación para cada usuario interesado
      for (const userId of interestedUserIds) {
        await api.createNotification({
          idProvider: userId,
          type: "new_petition",
          message: `Nueva petición: ${petition.description}`,
          viewed: false,
          idUserUpdate: session?.user?.id || 0,
          idUserCreate: session?.user?.id || 0,
          deleted: false,
        });
      }
    } catch (error) {
      console.error("Error notifying users:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Descripción de la Petición *
        </label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe detalladamente lo que necesitas..."
          className="min-h-32"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Categoría/Interés *
        </label>
        <Select
          value={formData.selectedCategory}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.idCategory}
                value={category.idCategory.toString()}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Fecha Desde</label>
          <Input
            type="date"
            name="dateSince"
            value={formData.dateSince}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fecha Hasta</label>
          <Input
            type="date"
            name="dateUntil"
            value={formData.dateUntil}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creando..." : "Crear Petición"}
      </Button>
    </form>
  );
}

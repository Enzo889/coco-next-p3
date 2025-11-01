"use client";

import type React from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { IPostulation } from "@/types/postulation.interface";
import { api } from "@/app/api/service";

interface PostulationFormProps {
  petitionId: number;
  onSuccess: () => void;
}

export default function PostulationForm({
  petitionId,
  onSuccess,
}: PostulationFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    proposal: "",
    cost: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.proposal || !formData.cost) {
      toast.error("Error", {
        description: "Por favor completa todos los campos",
      });
      return;
    }

    try {
      setLoading(true);

      const newPostulation: IPostulation = {
        idpostulation: 0,
        idPetition: petitionId.toString(),
        idProvider: session?.user?.id?.toString() || "",
        winner: false,
        proposal: formData.proposal,
        cost: formData.cost,
        idState: 1, // Pendiente
        idUserCreate: session?.user?.id?.toString() || "",
        idUserUpdate: session?.user?.id?.toString() || "",
        dateCreate: new Date(),
        dateUpdate: new Date(),
      };

      await api.createPostulation(newPostulation);

      toast.success("Exito", {
        description: "Postulación creada exitosamente",
      });

      setFormData({ proposal: "", cost: "" });
      onSuccess();
    } catch (error) {
      console.error("Error creating postulation:", error);
      toast.error("Error", {
        description: "No se pudo crear la postulación",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Mi Propuesta *</label>
        <Textarea
          name="proposal"
          value={formData.proposal}
          onChange={handleInputChange}
          placeholder="Describe tu propuesta de solución..."
          className="min-h-24"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Costo Propuesto *
        </label>
        <Input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleInputChange}
          placeholder="Ingresa el costo de tu servicio"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Enviando..." : "Enviar Postulación"}
      </Button>
    </form>
  );
}

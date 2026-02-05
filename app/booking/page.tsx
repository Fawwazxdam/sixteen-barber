"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../../components/ui/button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import { idrFormat } from "../../lib/utils";
import { DayPicker } from "react-day-picker";
import toast from "react-hot-toast";
import axios from "axios";
import "react-day-picker/dist/style.css";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface Barber {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    barber: "",
    service: "",
    date: undefined as Date | undefined,
    time: "09:00",
    message: "",
  });

  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<
    { start: string; end: string }[]
  >([]);

  const [slotLoading, setSlotLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, barbersResponse] = await Promise.all([
          axios.get<Service[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services`),
          axios.get<Barber[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/barbers`),
        ]);

        const servicesData = servicesResponse.data;
        const barbersData = barbersResponse.data;

        const activeServices = servicesData.filter(
          (service) => service.isActive,
        );
        setServices(activeServices);
        setBarbers(barbersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!formData.barber || !formData.date) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setSlotLoading(true);

      if (!formData.date) return;
      const dateStr = formData.date.toISOString().split("T")[0];

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/available-slots?date=${dateStr}&barberId=${formData.barber}`,
        );

        setAvailableSlots(res.data);
      } catch (err) {
        toast.error("Gagal memuat slot waktu");
        setAvailableSlots([]);
      } finally {
        setSlotLoading(false);
      }
    };

    fetchSlots();
  }, [formData.barber, formData.date]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    const selectedService = services.find((s) => s.id === formData.service);
    if (!selectedService) {
      alert("Please select a service");
      return;
    }

    if (!formData.date) {
      alert("Please select a date");
      return;
    }
    const dateStr = formData.date.toISOString().split("T")[0];
    const bookingTime = `${dateStr}T${formData.time}:00`;

    const payload = {
      barberId: formData.barber,
      serviceId: formData.service,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerNote: formData.message || undefined,
      bookingTime,
      duration: selectedService.duration,
    };

    setSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`,
        payload,
      );

      toast.success("Pesanan berhasil dibuat!");
      // Reset form
      setFormData({
        name: "",
        phone: "",
        barber: "",
        service: "",
        date: undefined,
        time: "09:00",
        message: "",
      });
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          `Kesalahan: ${err.response?.data?.message || err.message}`,
        );
      } else {
        toast.error(
          `Kesalahan: ${err instanceof Error ? err.message : "Kesalahan tidak diketahui"}`,
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const barberOptions = barbers.map((barber) => ({
    value: barber.id,
    label: barber.name,
  }));

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: `${service.name} - ${idrFormat(service.price)} (${service.duration} min)`,
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-100 relative">
      {/* Vintage texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <Header />

      <main className="relative z-10 pt-24 pb-12">
        <div className="mx-auto px-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-amber-200/50">
            <h1 className="text-3xl font-bold mb-8 text-center text-amber-900 font-playfair">
              Pesan Janji Temu Anda
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Nama"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Tukang Cukur"
                  name="barber"
                  value={formData.barber}
                  onChange={handleChange}
                  options={barberOptions}
                  required
                  disabled={loading}
                />
                {loading && (
                  <p className="text-sm text-amber-600 mt-1">
                    Memuat tukang cukur...
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-600 mt-1">
                    Error memuat tukang cukur: {error}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Telepon"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Layanan"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  options={serviceOptions}
                  required
                  disabled={loading}
                />
                {loading && (
                  <p className="text-sm text-amber-600 mt-1">
                    Memuat layanan...
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-600 mt-1">
                    Error memuat layanan: {error}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-amber-900">
                    Tanggal Pilihan
                  </label>
                  {/* Mobile: DayPicker */}
                  <div className="md:hidden">
                    <DayPicker
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      className="border border-amber-300 rounded-lg p-4 bg-white text-amber-900"
                      disabled={{ before: new Date() }}
                    />
                  </div>
                  {/* Desktop: Date Input */}
                  <div className="hidden md:block">
                    <input
                      type="date"
                      name="date"
                      value={
                        formData.date
                          ? formData.date.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-amber-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-900">
                    Slot Tersedia
                  </label>

                  {slotLoading && (
                    <p className="text-sm text-amber-600">Memuat slot...</p>
                  )}

                  {!slotLoading && availableSlots.length === 0 && (
                    <p className="text-sm text-red-600">
                      Tidak ada slot tersedia
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => {
                      const time = new Date(slot.start)
                        .toTimeString()
                        .slice(0, 5);

                      return (
                        <Button
                          key={slot.start}
                          type="button"
                          variant={
                            formData.time === time ? "default" : "outline"
                          }
                          onClick={() => setFormData({ ...formData, time })}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Textarea
                label="Pesan Tambahan"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
              />
              <Button
                type="submit"
                variant="default"
                className="w-full text-lg py-3"
                disabled={submitting}
              >
                {submitting ? "Membuat Pesanan..." : "Pesan Janji Temu"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;

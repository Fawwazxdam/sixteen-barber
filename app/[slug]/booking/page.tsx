"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/landing/layout/Navbar";
import { Footer } from "@/components/landing/layout/Footer";
import { TenantNavbar } from "@/components/landing/layout/TenantNavbar";
import { TenantFooter } from "@/components/landing/layout/TenantFooter";
import { Button } from "@/components/landing/ui/Button";
import { FloatingWhatsApp } from "@/components/landing/ui/FloatingWhatsApp";
import { idrFormat } from "@/lib/utils";
import { getTenantBySlug } from "@/lib/api/tenants";
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

interface Tenant {
    id: string;
    name: string;
    slug: string;
    address?: string;
    phone?: string;
}

const Booking = () => {
    const params = useParams();
    const slug = params?.slug as string;

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
    
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [tenantLoading, setTenantLoading] = useState(true);
    const [tenantError, setTenantError] = useState<string | null>(null);

    const [services, setServices] = useState<Service[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<
        { start: string; end: string }[]
    >([]);
    const [slotMessage, setSlotMessage] = useState<string | null>(null);

    const [slotLoading, setSlotLoading] = useState(false);

    useEffect(() => {
        if (!slug) return;
        
        const fetchTenant = async () => {
            try {
                const data = await getTenantBySlug(slug);
                if (data) {
                    setTenant(data);
                } else {
                    setTenantError("Store tidak ditemukan");
                }
            } catch (err) {
                console.error("Error fetching tenant:", err);
                setTenantError("Gagal memuat informasi store");
            } finally {
                setTenantLoading(false);
            }
        };

        fetchTenant();
    }, [slug]);

    useEffect(() => {
        if (!tenant?.id) return;

        const fetchData = async () => {
            try {
                const [servicesResponse, barbersResponse] = await Promise.all([
                    axios.get<Service[]>(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/services?tenantId=${tenant.id}`,
                    ),
                    axios.get<Barber[]>(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/barbers?tenantId=${tenant.id}`,
                    ),
                ]);

                // Handle nested data structures correctly depending on response shape
                const servicesData = (servicesResponse.data as any)?.data || servicesResponse.data || [];
                const barbersData = (barbersResponse.data as any)?.data || barbersResponse.data || [];

                const activeServices = Array.isArray(servicesData) ? servicesData.filter(
                    (service: Service) => service.isActive,
                ) : [];
                setServices(activeServices);
                setBarbers(Array.isArray(barbersData) ? barbersData : []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tenant?.id]);

    useEffect(() => {
        if (!formData.barber || !formData.date || !tenant?.id) {
            setAvailableSlots([]);
            setSlotMessage(null);
            return;
        }

        const fetchSlots = async () => {
            setSlotLoading(true);

            if (!formData.date) return;
            const dateStr = formData.date.toISOString().split("T")[0];

            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/available-slots?date=${dateStr}&barberId=${formData.barber}&tenantId=${tenant.id}`,
                );

                const slots = res.data?.data || res.data || [];
                const message = res.data?.message || null;
                setAvailableSlots(Array.isArray(slots) ? slots : []);
                setSlotMessage(message);
            } catch (err) {
                toast.error("Gagal memuat slot waktu");
                setAvailableSlots([]);
                setSlotMessage(null);
            } finally {
                setSlotLoading(false);
            }
        };

        fetchSlots();
    }, [formData.barber, formData.date, tenant?.id]);

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

        if (!tenant?.id) {
            toast.error("Data store tidak valid");
            return;
        }

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
            tenantId: tenant.id,
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
            const responseData = response.data.data || response.data;
            const bookingId = responseData?.id || responseData?.booking?.id;
            if (bookingId) {
                router.push(`/${slug}/booking/success?id=${bookingId}`);
            } else {
                router.push("/");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                toast.error(`Kesalahan: ${err.response?.data?.message || err.message}`);
            } else {
                toast.error(
                    `Kesalahan: ${err instanceof Error ? err.message : "Kesalahan tidak diketahui"}`,
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (tenantLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Mencari informasi store...</p>
                </div>
            </div>
        );
    }

    if (tenantError || !tenant) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-gray-900 dark:text-white font-sans selection:bg-amber-200">
                <Navbar />
                <main className="pt-32 pb-20 px-6 min-h-[calc(100vh-20rem)] flex items-center justify-center">
                    <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-10 text-center border border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">❌</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">
                            Store Tidak Ditemukan
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">{tenantError || "Pastikan URL / slug sudah benar."}</p>
                        <Button
                            onClick={() => router.push("/")}
                            className="w-full text-lg py-6"
                        >
                            Kembali ke Beranda
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const barberOptions = barbers.map((barber) => ({
        value: barber.id,
        label: barber.name,
    }));

    const serviceOptions = services.map((service) => ({
        value: service.id,
        label: `${service.name} - ${idrFormat(service.price)} (${service.duration} min)`,
    }));

    return (
        <div className="min-h-screen bg-neutral-50 text-gray-900 dark:bg-neutral-900 dark:text-white font-sans selection:bg-amber-200">
            <TenantNavbar tenantName={tenant.name} tenantSlug={slug} />

            <main className="pt-32 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block text-amber-600 font-bold text-xs uppercase tracking-widest mb-4 dark:text-amber-400">
                            Reservasi Online di
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight dark:text-white uppercase">
                            {tenant.name}
                        </h1>
                        {tenant.address && (
                            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-lg mx-auto">
                                {tenant.address}
                            </p>
                        )}
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-neutral-50 dark:bg-neutral-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        Tukang Cukur
                                    </label>
                                    <select
                                        name="barber"
                                        value={formData.barber}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-neutral-50 dark:bg-neutral-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors outline-none disabled:opacity-50"
                                    >
                                        <option value="" disabled>Pilih Tukang Cukur</option>
                                        {barberOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {loading && <p className="text-xs text-amber-600 mt-1">Memuat tukang cukur...</p>}
                                    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-neutral-50 dark:bg-neutral-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        Layanan
                                    </label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-neutral-50 dark:bg-neutral-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors outline-none disabled:opacity-50"
                                    >
                                        <option value="" disabled>Pilih Layanan</option>
                                        {serviceOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        Tanggal Pilihan
                                    </label>
                                    {/* Mobile: DayPicker */}
                                    <div className="md:hidden flex justify-center">
                                        <DayPicker
                                            mode="single"
                                            selected={formData.date}
                                            onSelect={(date) => setFormData({ ...formData, date })}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900 dark:text-white"
                                            disabled={{ before: new Date() }}
                                        />
                                    </div>
                                    {/* Desktop: Date Input */}
                                    <div className="hidden md:block">
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date ? formData.date.toISOString().split("T")[0] : ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    date: e.target.value ? new Date(e.target.value) : undefined,
                                                })
                                            }
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-neutral-50 dark:bg-neutral-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        Slot Tersedia
                                    </label>

                                    {slotLoading && <p className="text-sm text-amber-600 font-medium">Memuat slot...</p>}
                                    {!slotLoading && availableSlots.length === 0 && (
                                        <p className="text-sm text-red-500 font-medium">
                                            {slotMessage || "Tidak ada slot tersedia"}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-3 gap-2">
                                        {availableSlots.map((slot) => {
                                            const time = new Date(slot.start).toTimeString().slice(0, 5);
                                            const isSelected = formData.time === time;
                                            return (
                                                <button
                                                    key={slot.start}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, time })}
                                                    className={`py-2 rounded-lg text-sm font-bold transition-all ${isSelected
                                                            ? "bg-amber-500 text-white border border-amber-500 shadow-md scale-105"
                                                            : "bg-neutral-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                    Pesan Tambahan
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-neutral-50 dark:bg-neutral-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors outline-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={submitting}
                                className="w-full text-lg py-6 mt-4"
                            >
                                {submitting ? "Memproses..." : "Konfirmasi Booking"}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>

            <TenantFooter tenantName={tenant.name} />
            <FloatingWhatsApp phoneNumber={tenant.phone} tenantName={tenant.name} />
        </div>
    );
};

export default Booking;

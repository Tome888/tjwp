"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const nameRegex = /^[A-Za-zÀ-ž\s'-]{2,50}$/;

const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const messageRegex = /^[\s\S]{10,1000}$/;

interface ContactProps {
  data: {
    nameLabel: string;
    nameInput: string;
    phoneLabel: string;
    PhoneInput: string;
    emailLabel: string;
    emailInput: string;
    messageLabel: string;
    messageInput: string;
    buttonText: string;
    contactLinks: Array<{ linkName: string; URL: string }>;
  };
}

export function Contact({ data }: ContactProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const validateForm = () => {
    if (!nameRegex.test(formData.name)) {
      toast({
        variant: "destructive",
        title: "Invalid name",
        description: "Please enter a valid name.",
      });
      return false;
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
      });
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return false;
    }

    if (!messageRegex.test(formData.message)) {
      toast({
        variant: "destructive",
        title: "Message too short",
        description: "Message must be at least 10 characters.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
    const bunddleMessage = `
    Name: ${formData.name}
    Phone: ${formData.phone}
    Email: ${formData.email}
    Message: ${formData.message}
    `;

    try {
      const templateParams = {
        user_name: formData.name,
        user_phone: formData.phone,
        user_email: formData.email,
        message: bunddleMessage,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I will get back to you soon.",
      });

      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description:
          "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section ref={sectionRef} className="py-20 px-4 border-t border-border/40">
      <div className="container mx-auto max-w-4xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            {data.nameLabel === "Name" ? "Get In Touch" : "Контактирајте ме"}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{data.nameLabel}</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={data.nameInput}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{data.phoneLabel}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={data.PhoneInput}
                    value={formData.phone}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{data.emailLabel}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={data.emailInput}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{data.messageLabel}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={data.messageInput}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="transition-all duration-300 focus:scale-[1.02] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="group-hover:scale-105 transition-transform inline-block">
                      {data.buttonText}
                    </span>
                  )}
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4">
                  {data.nameLabel === "Name"
                    ? "Connect With Me"
                    : "Поврзете се"}
                </h3>
                <div className="space-y-3">
                  {data.contactLinks.map((link, index) => {
                    const isEmail = link.linkName.includes("Email");
                    const href = isEmail ? `mailto:${link.URL}` : link.URL;

                    return (
                      <a
                        key={index}
                        href={href}
                        target={isEmail ? undefined : "_blank"}
                        rel={isEmail ? undefined : "noopener noreferrer"}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:translate-x-2 group"
                      >
                        <span className="text-lg">{link.linkName}</span>
                      </a>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
                <p className="text-muted-foreground leading-relaxed">
                  {data.nameLabel === "Name"
                    ? "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!"
                    : "Секогаш сум отворен за дискусија за нови проекти, креативни идеи или можности да бидам дел од вашата визија. Слободно контактирајте ме!"}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

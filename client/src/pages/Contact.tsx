import { useState } from "react";
import { Mail, MapPin, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    isWholesaleInquiry: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    },
    onError: () => {
      toast.error("Failed to send message. Please try again or email us directly.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate(form);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-black mb-3">Contact <span className="text-primary">Us</span></h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Have a question or want to discuss a wholesale partnership? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-bold text-foreground mb-5">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
                    <a href="mailto:services@cckshop.com" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                      services@cckshop.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Address</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      6 Tower Ave<br />
                      Egg Harbor Township, NJ 08234<br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Business Hours</p>
                    <p className="text-sm text-foreground">Mon – Fri: 9am – 6pm EST</p>
                    <p className="text-sm text-muted-foreground">Sat – Sun: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h4 className="font-bold text-foreground mb-2">Wholesale Inquiries</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Interested in bulk orders? Our wholesale team typically responds within 4 business hours.
              </p>
              <a href="mailto:services@cckshop.com" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                services@cckshop.com <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-border p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll reply to <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", subject: "", message: "", isWholesaleInquiry: false }); }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-bold text-foreground text-lg mb-5">Send Us a Message</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="John Smith"
                        className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Company (Optional)</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={e => setForm({ ...form, company: e.target.value })}
                        placeholder="Your Company"
                        className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                      required
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isWholesaleInquiry}
                      onChange={e => setForm({ ...form, isWholesaleInquiry: e.target.checked })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">This is a wholesale inquiry</span>
                  </label>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2 font-semibold"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "Sending..." : "Send Message"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl"
          >
            <h1 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">Get in Touch</h1>
            <p className="mb-10 text-muted-foreground">Have questions? We'd love to hear from you.</p>

            <div className="grid gap-10 md:grid-cols-2">
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "roshandatainstitute@gmail.com" },
                  { icon: Phone, label: "Phone", value: "0702 171 149" },
                  { icon: MapPin, label: "Location", value: "Nairobi, Kenya" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                      <item.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Your Name" />
                <Input placeholder="Email Address" type="email" />
                <Textarea placeholder="Your Message" rows={5} />
                <Button variant="hero" className="w-full">Send Message</Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowRight, Send } from 'lucide-react';

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="pt-16 min-h-screen bg-bg">
      
      {/* AI Generated Banner */}
      <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden">
        <img 
          src="/new-contact-banner.jpg" 
          alt="Contact Nashta" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-black uppercase italic tracking-tighter text-white"
          >
            Get In <span className="text-primary">Touch.</span>
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          
          {/* Left: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter mb-4">
                We'd love to hear from you
              </h2>
              <p className="text-text-muted text-lg">
                Whether you have a question about our flavours, want to stock Nashta in your store, or just want to say hi—drop us a line!
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-full bg-surface border border-text/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold uppercase tracking-wider mb-1">Email Us</h4>
                  <a href="mailto:hello@nashta.co.in" className="text-text-muted hover:text-primary transition-colors text-lg">hello@nashta.co.in</a>
                </div>
              </div>
              
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-full bg-surface border border-text/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold uppercase tracking-wider mb-1">Call Us</h4>
                  <a href="tel:+919876543210" className="text-text-muted hover:text-primary transition-colors text-lg">+91 98765 43210</a>
                  <p className="text-sm text-text/40 mt-1">Mon-Fri, 10am-6pm IST</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-full bg-surface border border-text/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold uppercase tracking-wider mb-1">Headquarters</h4>
                  <p className="text-text-muted text-lg leading-relaxed">
                    101, Snack Street,<br />
                    Koramangala, Bengaluru,<br />
                    Karnataka - 560034
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-surface p-8 md:p-10 rounded-[2.5rem] border border-text/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -z-10" />
              
              <h3 className="text-2xl font-display font-bold uppercase tracking-wider mb-8">Send a Message</h3>
              
              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                  </div>
                  <h4 className="text-2xl font-display font-bold uppercase mb-2">Message Sent!</h4>
                  <p className="text-text-muted">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-8 text-primary font-bold uppercase tracking-wider text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-2">Your Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-bg border border-text/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-2">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-bg border border-text/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-2">Inquiry Type</label>
                    <div className="relative">
                      <select required className="w-full bg-bg border border-text/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                        <option value="">Select a topic...</option>
                        <option value="order">Where is my order?</option>
                        <option value="feedback">Product Feedback</option>
                        <option value="wholesale">Wholesale & Stocking</option>
                        <option value="press">Press & Media</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-2">Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full bg-bg border border-text/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 bg-text text-bg rounded-full font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
                  >
                    {formStatus === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Sending...
                      </span>
                    ) : (
                      <>Send Message <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

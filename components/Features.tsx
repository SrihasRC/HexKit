'use client'
import { motion } from "framer-motion";
import { Flag, Shield, Terminal } from "lucide-react";

const Features = () => {
  return (
    <div>
      <div className="py-20 bg-[#0a0b10]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
              <h3 className="text-primary text-sm font-medium">
                Power-Packed Features
              </h3>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Why HexKit?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Designed specifically for CTF competitors who need reliable tools
              for quick analysis and transformations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="p-6 rounded-xl border border-[#2a2c37] bg-[#12141c] backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Flag className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                All-in-One Solution
              </h3>
              <p className="text-white/70">
                Access all the essential tools you need for CTF challenges in
                one place, no need to switch between different websites.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border border-[#2a2c37] bg-[#12141c] backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Privacy Focused
              </h3>
              <p className="text-white/70">
                All operations run directly in your browser - no data is ever
                sent to servers, keeping your sensitive information secure.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border border-[#2a2c37] bg-[#12141c] backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Built for Hackers
              </h3>
              <p className="text-white/70">
                Designed with a clean, efficient interface featuring keyboard
                shortcuts and a dark mode optimized for long coding sessions.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;

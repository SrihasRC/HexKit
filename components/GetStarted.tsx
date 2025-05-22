'use client'
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const GetStarted = () => {
  return (
    <div className="bg-[#0F1117] py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
            <h3 className="text-primary text-sm font-medium">Start Hacking</h3>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to solve some challenges?
          </h2>
          <p className="text-white/70 mb-8">
            Get started with our comprehensive set of CTF tools and improve your
            hacking skills today.
          </p>
          <Link href="/tools">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Zap className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default GetStarted;

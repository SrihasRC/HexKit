'use client'
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toolCategories } from "../app/content";

const Tools = () => {
  return (
    <section id="tools" className="py-20 bg-[#0a0b10]">
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
              Essential Utilities
            </h3>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Our Tools</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            A comprehensive collection of tools to help you conquer any Capture
            The Flag challenge with ease and precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {toolCategories.map((category, index) => (
            <motion.div
              key={category.name}
              className="p-6 rounded-xl border border-[#2a2c37] bg-[#12141c]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {category.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="group block">
                      <div className="flex items-center">
                        <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity mr-2" />
                        <span className="text-white group-hover:text-primary transition-colors font-medium">
                          {tool.title}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm ml-6 mt-1">
                        {tool.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={`/tools?category=${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <Button
                  variant="outline"
                  className="text-white/80 cursor-pointer border-[#2a2c37] hover:bg-primary/10 hover:text-white text-sm w-full justify-between group"
                >
                  <span>View {category.name} Tools</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/tools">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Zap className="w-4 h-4 mr-2" />
              Explore All Tools
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Tools;

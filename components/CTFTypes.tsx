'use client'
import { ctfChallenges } from "@/app/content";
import { motion } from "framer-motion";

const CTFTypes = () => {
  return (
    <div>
      <div className="py-20 bg-[#0F1117]">
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
                Tackle Any Challenge
              </h3>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Common CTF Categories
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our tools are designed to help you tackle a wide range of CTF
              challenge types.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ctfChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                className="p-6 rounded-xl border border-[#2a2c37] bg-gradient-to-br from-[#12141c] to-[#0F1117]"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <challenge.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {challenge.title}
                    </h3>
                    <p className="text-white/70 mb-4">
                      {challenge.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs text-primary/90"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTFTypes;

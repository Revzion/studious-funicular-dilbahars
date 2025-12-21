import { Users, HeartHandshake, ShieldCheck, Smile } from "lucide-react";

const OurTeamSection = () => {
  return (
    <section className="bg-blue-50 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
          What Makes Our Team <span className="text-green-600">Exceptional</span>
        </h2>
        <p className="text-blue-700 max-w-2xl mx-auto text-lg mb-12">
          Behind every sweet treat is a dedicated team of over 400 passionate individuals
          working across departments to bring the Dilbahar's promise to life.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="text-rose-500 mb-3">
              <HeartHandshake size={32} />
            </div>
            <h3 className="font-semibold text-xl text-blue-800 mb-2">Team of 400+</h3>
            <p className="text-blue-600 text-sm">
              From production to packaging, every team member plays a vital role in delivering excellence.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="text-purple-500 mb-3">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-semibold text-xl text-blue-800 mb-2">Skilled & Trusted</h3>
            <p className="text-blue-600 text-sm">
              Every individual is trained in quality and hygiene standards to maintain product integrity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="text-blue-500 mb-3">
              <Smile size={32} />
            </div>
            <h3 className="font-semibold text-xl text-blue-800 mb-2">Driven by Passion</h3>
            <p className="text-blue-600 text-sm">
              Our team takes pride in blending tradition with innovation — making each bite special.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="text-yellow-500 mb-3">
              <Users size={32} />
            </div>
            <h3 className="font-semibold text-xl text-blue-800 mb-2">Strong Collaboration</h3>
            <p className="text-blue-600 text-sm">
              Our success stems from teamwork, transparent communication, and shared goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTeamSection;

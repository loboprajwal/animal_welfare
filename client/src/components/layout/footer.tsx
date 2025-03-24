import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Send, Dog } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <div className="flex items-center mb-4">
              <Dog className="h-6 w-6 text-primary mr-2" />
              <span className="font-heading font-bold text-xl">Animal<span className="text-primary">SOS</span></span>
            </div>
            <p className="text-neutral-400 mb-4">
              Connecting animals in need with people who care. Our mission is to improve animal welfare through technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/report-animal" className="text-neutral-400 hover:text-primary transition-colors">Report Animal</Link></li>
              <li><Link href="/find-vets" className="text-neutral-400 hover:text-primary transition-colors">Find Vets</Link></li>
              <li><Link href="/adopt" className="text-neutral-400 hover:text-primary transition-colors">Adopt</Link></li>
              <li><Link href="/donate" className="text-neutral-400 hover:text-primary transition-colors">Donate</Link></li>
              <li><Link href="/community" className="text-neutral-400 hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Pet Care Tips</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Emergency First Aid</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Animal Laws</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Become a Volunteer</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Partner with Us</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-neutral-400" />
                <span className="text-neutral-400">123 Animal Welfare Road, Mumbai, India 400001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-neutral-400" />
                <span className="text-neutral-400">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-neutral-400" />
                <span className="text-neutral-400">help@animalsos.org</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="rounded-r-none text-neutral-800 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button variant="default" className="bg-primary rounded-l-none p-2">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">© 2023 AnimalSOS. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-neutral-400 text-sm hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-neutral-400 text-sm hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-neutral-400 text-sm hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

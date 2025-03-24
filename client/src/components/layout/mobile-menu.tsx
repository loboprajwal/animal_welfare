import { Link } from "wouter";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { name: string; path: string }[];
  user: User | null;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  user,
  onLogout
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white py-3 shadow-inner"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className="py-2 font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={onClose}
                className="py-2 font-medium hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}
            
            <div className="flex flex-col space-y-2 pt-2 border-t border-neutral-200">
              {user ? (
                <>
                  <div className="py-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                  </div>
                  <Button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full py-2 font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth" onClick={onClose}>
                    <Button
                      variant="outline"
                      className="w-full py-2 font-medium text-primary border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth" onClick={onClose}>
                    <Button
                      className="w-full py-2 font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;

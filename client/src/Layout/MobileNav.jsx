import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet'
import Menu from '../Layout/Menu';
import { GiHamburgerMenu } from "react-icons/gi";
const Mobilenav = () => {
  return (
    <div>
      <Sheet >
        <SheetTrigger>
          <div size={40} className="text-lamateal text-[24px] px-2">
          <GiHamburgerMenu  />
          </div>
        </SheetTrigger>
        <SheetContent className="bg-[#fff]" side="left">
          <Menu open={true}/>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Mobilenav;

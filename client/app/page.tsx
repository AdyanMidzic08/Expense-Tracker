import Navbar from "./components/Navbar";

export default function home() {
   return (
    <>
      <Navbar>
         <div className="flex flex-col gap-4">
            <a href="/">Startseite</a>
            <a href="/zahlungen">Zahlungen</a>
         </div>
      </Navbar>

    </>
   );
}


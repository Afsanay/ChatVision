import Link from "next/link"
export default function Navbar() {
    return (
        <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
            <div className="text-xl font-bold">ChatVision</div>
            <div className="text-md font bold">
                <Link href={"./logout"} className="font-bold">LogOut</Link>
            </div>
          </nav>
        )
}
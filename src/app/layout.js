import "./globals.css";

export const metadata = {
    title: "Bag Shape Editor — 3D",
    description: "Éditeur 3D de formes de sacs rectangulaires",
};

export default function RootLayout({children}) {
    return (
        <html lang="fr">
        <body>{children}</body>
        </html>
    );
}
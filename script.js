document.addEventListener("DOMContentLoaded", async () => {
    const docContainer = document.getElementById("doc-container");
    const sectionMenu = document.getElementById("section-menu");

    try {
       
        const response = await fetch("./docs/example.docx"); 
        
        if (!response.ok) throw new Error("No se pudo cargar el documento");

        const arrayBuffer = await response.arrayBuffer(); 

        const result = await mammoth.convertToHtml({ arrayBuffer });


        const htmlContent = result.value;

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

     
        console.log(htmlContent);  

        const sections = doc.querySelectorAll("h1, h2, h3");
        if (sections.length === 0) {
            console.log("No se encontraron secciones en el documento.");
            docContainer.innerHTML = "<p>No se encontraron secciones en el documento.</p>";
        } else {
            sections.forEach((section, index) => {
                const sectionId = `section-${index}`;
                section.id = sectionId;

                // Agregar enlace al menú
                const li = document.createElement("li");
                li.textContent = section.textContent;
                li.addEventListener("click", () => {
                    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
                });
                sectionMenu.appendChild(li);
            });
        }

       
        docContainer.innerHTML = doc.body.innerHTML;
    } catch (error) {
        console.error("Error al cargar o procesar el documento:", error);
        docContainer.textContent = "No se pudo cargar el documento.";
    }
});

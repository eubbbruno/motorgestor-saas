# Imagens e Assets

- NUNCA usar next/image para SVG — usar sempre <img> nativa
- Para PNG/JPG com next/image: sempre incluir unoptimized se for da pasta /public
- Logos: sempre <img src="/images/nome.png" alt="..." className="h-X w-auto" />
- Após adicionar qualquer imagem em /public: sempre rodar git add public/ antes do commit

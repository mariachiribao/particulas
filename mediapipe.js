function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        let totalExpansion = 0;

        results.multiHandLandmarks.forEach(hand => {
            const thumb = hand[4];
            const index = hand[8];

            // Calcular distancia (tensión)
            const dx = thumb.x - index.x;
            const dy = thumb.y - index.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            totalExpansion += dist * 10; // Multiplicador de escala
        });

        // Aplicar expansión a las partículas
        const posAttr = points.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
            posAttr.array[i*3] = originalPositions[i*3] * totalExpansion;
            posAttr.array[i*3+1] = originalPositions[i*3+1] * totalExpansion;
            posAttr.array[i*3+2] = originalPositions[i*3+2] * totalExpansion;
        }
        posAttr.needsUpdate = true;
    }
}
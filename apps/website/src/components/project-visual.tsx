import type { Project } from "~/components/projects";

/**
 * Draws a project-specific schematic using local SVG artwork.
 * @param props - The project's visual motif.
 * @returns A decorative terminal-style illustration.
 */
export function ProjectVisual({ motif }: { motif: Project["motif"] }) {
  return (
    <svg className="project-visual" viewBox="0 0 400 180" fill="none" aria-hidden="true">
      <g className="project-visual__guides" stroke="currentColor" strokeWidth="1">
        <path d="M40 150H360M70 30V160M330 30V160M40 90H360" strokeDasharray="3 7" />
        <path d="M40 30h12m-6-6v12m302 108h12m-6-6v12" />
      </g>
      <g className="project-visual__drawing" stroke="currentColor" strokeWidth="2">
        {motif === "press" && (
          <>
            <path d="M130 148V44h140v104M117 44h166M155 148v-42h90v42M148 106h104M155 125h90M200 24v62M181 24h38M177 86h46" />
            <path
              className="project-visual__moving"
              d="M169 64h16v16h-16zm46 0h16v16h-16zM185 82h16v16h-16z"
            />
            <path d="M100 148h200M200 148v14m-20 0h40" />
          </>
        )}
        {motif === "terminal" && (
          <>
            <path d="M105 35h190v110H105zM105 57h190M116 46h4m8 0h4m8 0h4M145 76l12 10-12 10m28 0h26M165 160h70M200 145v15" />
            <path
              className="project-visual__moving"
              d="M237 126V86m0 17-18-18h18v18m0 12 18-18h-18v18"
            />
            <path d="M221 126h32" strokeDasharray="4 4" />
          </>
        )}
        {motif === "query" && (
          <>
            <path d="M132 57 106 90l26 33m136-66 26 33-26 33M211 48l-22 84" />
            <path
              className="project-visual__moving"
              d="M160 90h28m24 0h28M80 145h80v-12h80v12h80"
            />
            <path d="M55 68h24v44H55zm266 0h24v44h-24zM67 112v33h13m253-33v33h-13" />
          </>
        )}
        {motif === "index" && (
          <>
            <path d="M150 40h105v105H150zM136 54v105h105M122 68v105h105M166 63h54m-54 16h72m-72 16h40" />
            <path
              className="project-visual__moving"
              d="M277 60v80m0-60h35m-35 30h35m-35 30h35M305 73h14v14h-14zm0 30h14v14h-14zm0 30h14v14h-14zM255 100h22"
            />
            <path d="M166 116h42" strokeDasharray="5 5" />
          </>
        )}
        {motif === "agents" && (
          <>
            <path d="M174 64h52v52h-52zM185 82h5m20 0h5M188 99h24M200 64V44m-6 0h12M174 90h-52m104 0h52M200 116v32" />
            <g className="project-visual__moving">
              <path d="M91 72h30v36H91zm188 0h30v36h-30zM185 148h30v20h-30zM100 86h12m176 0h12M96 97h20m168 0h20" />
            </g>
            <path d="M145 40h-15v15m140-15h-15m15 0v15M145 140h-15v-15m140 15h-15m15 0v-15" />
          </>
        )}
        {motif === "storage" && (
          <>
            <path d="M120 150V64l80-36 80 36v86M120 64h160M142 86h116v26H142zm0 38h116v26H142zM155 99h12m-12 38h12M185 99h54m-54 38h54" />
            <path
              className="project-visual__moving"
              d="M92 125V82m0 17-13-13h13v13m0 14 13-13H92v13M308 125V82m0 17-13-13h13v13m0 14 13-13h-13v13"
            />
            <path d="M77 150h246" />
          </>
        )}
      </g>
    </svg>
  );
}

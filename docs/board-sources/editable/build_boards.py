from pathlib import Path
from html import escape
import fitz

OUT = Path(__file__).resolve().parents[1] / "assets"
W, H = 1600, 1000
INK, MUTED, LINE, BLUE = "#20252D", "#535C6C", "#D7DCE3", "#4262FF"
Y, G, P, B, L = "#FFF18C", "#D0EC95", "#F6C5DD", "#B6E6F7", "#DDCFF8"
LABEL = "Board reconstruction · Notes paraphrased"

class Board:
    def __init__(self, title, subtitle, zoom="64%"):
        self.parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">']
        self.rect(0, 0, W, H, "#F6F7F9")
        for y in range(16, H, 20):
            for x in range(12, W, 20):
                self.circle(x, y, .85, "#D9DDE4")
        self.panel(16, 16, max(360, 120+len(title)*10), 52)
        self.rect(26, 25, 40, 34, "#FFD02F", radius=5)
        self.text(46, 47, "miro", 15, True, anchor="middle")
        self.text(80, 49, title, 20, True)
        self.panel(1116, 16, 468, 52)
        self.text(1134, 48, LABEL, 15, True, MUTED)
        self.rect(1496, 25, 76, 34, BLUE, radius=5)
        self.text(1534, 47, "Share", 15, True, "#FFFFFF", "middle")
        self.panel(16, 279, 55, 391)
        for i, icon in enumerate(("select","templates","sticky","text","shape","pen","frame","comment","plus")):
            y = 290 + i * 41
            if i == 0:
                self.rect(22, y, 43, 36, "#E9EDFF", radius=5)
            self.icon(icon, 33, y+8, BLUE if i == 0 else INK)
        self.panel(16, 682, 55, 47)
        self.text(43, 712, "↶", 24, False, MUTED, "middle")
        self.panel(1342, 947, 242, 39)
        self.icon("frame", 1355, 957, MUTED)
        self.line(1385, 955, 1385, 977, LINE, 1)
        for x, value in ((1406,"−"),(1452,zoom),(1500,"+"),(1558,"?")):
            self.text(x, 973, value, 16, True, INK, "middle")
        self.text(110, 110, title, 34, True)
        self.text(112, 141, subtitle, 18, False, MUTED)

    def rect(self, x, y, w, h, fill, stroke="none", radius=0):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}"/>')

    def circle(self, x, y, r, fill):
        self.parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>')

    def text(self, x, y, value, size=20, bold=False, color=INK, anchor="start"):
        self.parts.append(f'<text x="{x}" y="{y}" font-family="sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}" text-anchor="{anchor}">{escape(value)}</text>')

    def paragraph(self, x, y, value, width, size=20, bold=False, color=INK, center=False):
        from PIL import ImageFont
        font = ImageFont.truetype("DejaVuSans" + ("-Bold" if bold else "") + ".ttf", size)
        rows = []
        for line in value.split("\n"):
            row = ""
            for word in line.split():
                candidate = f"{row} {word}".strip()
                if row and font.getlength(candidate) > width:
                    rows.append(row)
                    row = word
                else:
                    row = candidate
            rows.append(row)
        for i, row in enumerate(rows):
            self.text(x, y+i*size*1.27, row, size, bold, color, "middle" if center else "start")
        return len(rows)

    def line(self, x, y, xx, yy, color=MUTED, width=2):
        self.parts.append(f'<path d="M{x} {y}L{xx} {yy}" fill="none" stroke="{color}" stroke-width="{width}"/>')

    def path(self, d, color=MUTED, width=2, fill="none"):
        self.parts.append(f'<path d="{d}" fill="{fill}" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')

    def icon(self, name, x, y, color):
        paths = {
            "select":"M4 1L18 12L11 13L8 20Z",
            "templates":"M2 3H20V17H2ZM8 3V17M8 8H20",
            "sticky":"M3 2H19V13L13 19H3ZM13 19V13H19",
            "text":"M3 3H19M11 3V19M7 19H15",
            "shape":"M2 3H12V13H2ZM15 11L21 19H10Z",
            "pen":"M3 18L5 12L16 1L21 6L10 17ZM14 3L19 8",
            "frame":"M8 3H3V8M15 3H20V8M3 14V19H8M15 19H20V14",
            "comment":"M2 3H20V15H10L5 20V15H2Z",
            "plus":"M4 10H18M11 3V17",
        }
        self.parts.append(f'<g transform="translate({x} {y})">')
        self.path(paths[name], color, 1.65, color if name=="select" else "none")
        self.parts.append("</g>")

    def panel(self, x, y, w, h):
        self.rect(x+1, y+3, w, h, "#E1E4E9", radius=9)
        self.rect(x, y, w, h, "#FFFFFF", "#E3E6EB", 9)

    def frame(self, x, y, w, h, title):
        self.text(x, y-9, title, 15, True, MUTED)
        self.rect(x, y, w, h, "#FFFFFF", LINE)

    def note(self, x, y, w, h, value, fill=Y, size=18):
        self.rect(x+1, y+3, w, h, "#E1E3E6")
        self.rect(x, y, w, h, fill)
        self.paragraph(x+w/2, y+size+12, value, w-19, size, center=True)

    def selected(self, x, y, w, h):
        self.rect(x-3,y-3,w+6,h+6,"none",BLUE)
        for xx,yy in ((x-3,y-3),(x+w+3,y-3),(x-3,y+h+3),(x+w+3,y+h+3)):
            self.rect(xx-3,yy-3,6,6,"#FFFFFF",BLUE)

    def arrow(self, x, y, xx, yy):
        from math import atan2, cos, sin
        self.line(x,y,xx,yy)
        a=atan2(yy-y,xx-x)
        self.path(f"M{xx-10*cos(a-.45)} {yy-10*sin(a-.45)}L{xx} {yy}L{xx-10*cos(a+.45)} {yy-10*sin(a+.45)}")

    def save(self, slug):
        svg = OUT / f"{slug}.svg"
        svg.write_text("\n".join(self.parts + ["</svg>"]),encoding="utf-8")
        with fitz.open(stream=svg.read_bytes(),filetype="svg") as doc:
            doc[0].get_pixmap(matrix=fitz.Matrix(1.3,1.3),alpha=False).save(OUT / f"{slug}.png")

def notes(b, x,y,w,h, items, color=Y, cols=2, size=18, gap=14):
    for i,item in enumerate(items):
        b.note(x+i%cols*(w+gap),y+i//cols*(h+gap),w,h,item,color,size)

def group(b,x,y,w,h,title,items,color=Y,cols=2,note_h=85,size=18):
    b.frame(x,y,w,h,title)
    notes(b,x+20,y+22,(w-40-(cols-1)*14)/cols,note_h,items,color,cols,size)

def lanes(b, columns, colors, y=199, h=711, width=1440, x=112, note_h=79):
    gap=12
    w=(width-gap*(len(columns)-1))/len(columns)
    for i,(label,items) in enumerate(columns):
        xx=x+i*(w+gap)
        b.frame(xx,y,w,h,f"{i+1:02}  {label}")
        b.rect(xx+1,y+1,w-2,45,colors[i])
        b.text(xx+13,y+30,label,22,True)
        notes(b,xx+13,y+62,w-26,note_h,items,colors[i],1,18,12)

def discovery():
    b=Board("Solutions Architect · Role empathy map","Discovery workshop · What helped, what interrupted the work, and how the team adapted")
    b.frame(112,195,1440,700,"01  Role empathy mapping")
    b.line(263,237,1401,861,LINE,2)
    b.line(1401,237,263,861,LINE,2)
    clusters=[
        (522,221,114,5,"What works well",Y,["Mix of technical backgrounds","Strong proposal partnerships","Clear proposal milestones","Early architect involvement","Review stages give structure"]),
        (146,366,230,2,"Distractions",P,["Searching for earlier proposals","Meetings break up writing time","Short-notice opportunities","Unplanned requests compete with delivery","Switching between research and writing","Repeated tool interruptions"]),
        (1044,366,230,2,"Pain points",G,["Hard to find prior work and visuals","Few reusable templates","Difficulty finding the right specialists","Review feedback can lack detail","Late entry limits customer context","Urgent work crowds out early planning"]),
        (522,718,114,5,"Workarounds",B,["Reach out to colleagues","Research public sources","Draw on earlier experience","Adapt review materials","Make time around other commitments"]),
    ]
    for x,y,w,cols,label,color,items in clusters:
        total=w*cols+14*(cols-1)
        b.text(x+total/2,y+18,label,22,True,INK,"middle")
        notes(b,x,y+33,w,105 if cols==5 else 80,items,color,cols,16)
    b.circle(832,543,113,"#DFE3F1")
    b.circle(832,540,111,"#F0F2FF")
    b.circle(832,496,22,"#5666B8")
    b.path("M790 553Q793 527 832 527Q871 527 874 553Z","none",0,"#5666B8")
    b.text(832,585,"Solutions Architect",20,True,INK,"middle")
    b.save("sa-discovery")

def inventory():
    b=Board("Solutions Architect · Artifacts and key tasks","Discovery workshop · Inventory of the work architects do and the materials they create")
    artifacts=[
        "Materials and components list","Examples from earlier work","Initial graphic concepts",
        "Proposal and white paper drafts","Solution outlines","Workshop materials",
        "Review slides","Basis of estimate","Tables and process visuals",
    ]
    tasks=[
        "Research the customer and opportunity","Review work at key milestones","Write technical content",
        "Lead solution design sessions","Bring in subject matter experts","Develop oral presentation scenarios",
        "Coordinate resources and schedules","Work with vendors and partners","Develop cost and effort estimates",
        "Design the technical approach","Coordinate proposal contributors","Turn the approach into visuals",
    ]
    group(b,112,208,700,650,"01  Artifacts",artifacts,Y,3,135,18)
    group(b,832,208,721,650,"02  Key tasks",tasks,Y,3,135,18)
    b.save("sa-inventory")

def intake():
    b=Board("Solutions Architect · Intake deep dive","Discovery workshop · How work reaches the team and when earlier involvement would help")
    b.frame(112,197,1440,257,"01  Current intake · Two paths discussed")
    paths=[
        ("Opportunity review",["Qualification review","Assign an architect","Gather technical and customer context","Shape the pursuit plan"]),
        ("Direct request",["Request for information or white paper","Assign an architect","Clarify the request and gather context"]),
    ]
    for i,(label,steps) in enumerate(paths):
        y=229+i*104
        b.paragraph(140,y+29,label,158,17,True)
        for j,step in enumerate(steps):
            x=309+j*304
            b.note(x,y,261,71,step,B,16)
            if j<len(steps)-1:
                b.arrow(x+268,y+35,x+297,y+35)
    columns=[
        ("Arrival",["Business development assigns work","Informal outreach","Direct request for material"],B),
        ("What helps",["Direct coordination","Early discussion with the team"],Y),
        ("Friction",["Handoffs can skip steps","Limited access to customer context","Competitive context can be thin"],G),
        ("Late involvement",["After early customer discussions","After teaming decisions","After the approach starts to take shape"],P),
        ("Healthier intake",["Involve architects earlier","Clarify the handoff","Share context up front"],L),
    ]
    lanes(b,[(label,items) for label,items,_ in columns],[color for _,_,color in columns],y=509,h=375,note_h=83)
    b.save("sa-intake")

def process():
    b=Board("Solutions Architect · Solutioning process map","Process definition · Sample work products and templates by phase","58%")
    phases=[
        ("Identify","#E3E7EF",["Customer context","Meeting recap","Prior requirements","Readiness questions"]),
        ("Qualify","#DCE8FC",["Opportunity brief","Initial response outline","Risk questions","Early visual concepts","Relevant past work","Capabilities summary","Research notes","Planning template"]),
        ("Pursue","#DFEFD7",["Draft solution approach","Estimate inputs","Risk assessment","Team agreements","Review slides","Costing template"]),
        ("Proposal","#F8DFDE",["Staged review drafts","Estimate review","Oral presentation script","Feedback tracker","Section ownership","Updated risks"]),
        ("Submitted","#E8E1F6",["Debrief notes","Lessons for future efforts","Reusable solution material","Follow-up questions"]),
    ]
    for i,(label,color,items) in enumerate(phases):
        x=112+i*290
        b.frame(x,230,280,655,f"{i+1:02}  Solutioning phase")
        b.rect(x+1,231,278,54,color)
        b.text(x+15,264,label,22,True)
        notes(b,x+12,307,122,112,items,Y,2,16,12)
    b.save("sa-process")

def gap():
    b=Board("ADU course creation · Gap analysis","Discovery workshop · Quality criteria, lesson structure and human review","58%")
    phases=[
        ("Identify",["Keep terminology consistent","Check content for accuracy","Review lesson order and length","Define what quality means","Identify gaps in expert review"]),
        ("Investigate",["Find where wording varies","Check which steps need validation","Compare outputs with learning goals"]),
        ("Decide",["Agree on quality criteria","Set a lesson structure","Define reviewer responsibilities"]),
        ("Implement",["Validate content against the source","Challenge drafts against criteria","Check learning design","Route to a subject matter expert"]),
        ("Analyze",[]),
        ("Improve",[]),
    ]
    b.frame(112,190,1440,510,"01  Discovery themes by phase")
    for i,(label,items) in enumerate(phases):
        x=131+i*235
        fill=["#C9E6FA","#B5DDF7","#9CCCF5","#6AA7ED","#2355A2","#173D79"][i]
        b.path(f"M{x} 215H{x+200}L{x+215} 245L{x+200} 275H{x}Z",fill,1,fill)
        b.text(x+103,252,label,21,True,INK if i<4 else "#FFFFFF","middle")
        notes(b,x+6,301,204,62,items,Y,1,16,10)
    b.frame(112,755,1440,142,"02  Proposed review sequence")
    stages=["Gather source material","Generate a draft","Check against criteria","Human review and edits","Recheck revised draft","Advance to next step"]
    for i,stage in enumerate(stages):
        x=131+i*235
        b.rect(x,783,202,81,"#EDF3FC",LINE,8)
        b.paragraph(x+101,814,stage,166,17,True,center=True)
        if i<5:
            b.arrow(x+208,823,x+229,823)
    b.save("adu-gap")

def workflow():
    b=Board("ADU course creation · Workflow and quality gates","Process definition · Comparing two ways to draft, review and revise course materials","58%")
    steps=[
        ("Outline","Coverage and sequence"),
        ("Script","Accuracy and clarity"),
        ("Lesson content","Instructional fit"),
        ("Slides","Match lesson content"),
        ("Narration","Match the slides"),
        ("Self-assessment","Check learning"),
    ]
    for x,title,sub in [
        (112,"01  Shared team model","One team drafts the outline, script and lesson content."),
        (839,"02  Stage-specific model","Separate agents draft each artifact and can capture review notes."),
    ]:
        b.frame(x,193,700,712,title)
        b.text(x+20,228,sub,17,True)
        b.rect(x+128,244,199,38,"#E4F2D3",LINE,4)
        b.text(x+227,268,"Source material",16,True,INK,"middle")
        b.arrow(x+227,283,x+227,302)
        if x==112:
            b.rect(x+16,302,666,253,"#FFF9E4")
            b.paragraph(x+28,328,"Shared team",82,14,True)
        for i,(step,check) in enumerate(steps):
            y=306+i*85
            if x==839 or i>=3:
                b.rect(x+16,y-4,666,79,"#F4F6FB")
                b.paragraph(x+26,y+20,"Stage agent",80,14,True)
            b.rect(x+128,y+8,199,43,"#DBE8FA",LINE,4)
            b.text(x+227,y+35,step,18,True,INK,"middle")
            b.arrow(x+331,y+29,x+360,y+29)
            b.path(f"M{x+366} {y+29}L{x+472} {y+1}L{x+578} {y+29}L{x+472} {y+57}Z","#B5A4D3",1,"#ECE4F7")
            b.text(x+472,y+35,check,15,True,INK,"middle")
            b.path(f"M{x+578} {y+29}H{x+602}V{y+2}H{x+241}")
            b.arrow(x+241,y+2,x+241,y+8)
            b.text(x+612,y+24,"Revise",14,False,MUTED)
        # Draw progression connectors after the lane backgrounds.
        for i in range(len(steps)):
            y=306+i*85
            b.path(f"M{x+472} {y+57}V{y+64}H{x+227}")
            b.arrow(x+227,y+64,x+227,y+(93 if i<5 else 91))
        b.rect(x+128,822,199,39,"#E4F2D3",LINE,4)
        b.text(x+227,847,"Lesson materials",16,True,INK,"middle")
        b.text(x+20,884,"Exploration · Review content, learning design and assessment fit",15,False,MUTED)
    b.save("adu-quality-workflow")

def avatar(b,x,y,w,h):
    b.rect(x,y,w,h,"#ECEFFF")
    cx=x+w/2
    b.circle(cx,y+h*.38,h*.17,"#737FCC")
    b.path(f"M{cx-h*.30} {y+h*.87}Q{cx-h*.28} {y+h*.56} {cx} {y+h*.56}Q{cx+h*.28} {y+h*.56} {cx+h*.30} {y+h*.87}Z","none",0,"#737FCC")

def persona():
    b=Board("Addie · Teaching avatar persona","Agile Defense University · Discovery board for the teacher’s role, approach and voice")
    group(b,112,201,486,295,"01  Role and description",
          ["Guide learners like a mentor","Explain with confidence","Use a balanced perspective","Help learners see what matters"],B,2,113,18)
    group(b,112,541,486,353,"02  Teaching goals",
          ["Break down difficult ideas","Adapt to the learner’s starting point","Show why the material matters","Build confidence through practice"],Y,2,125,18)
    group(b,622,201,488,295,"03  Attitude and delivery",
          ["Sound warm and sincere","Bring energy to the lesson","Guide without talking down","Encourage the learner to try"],L,2,113,18)
    group(b,622,541,488,353,"04  Voice examples · Written for this reconstruction",
          ["Here’s where this shows up in a real task.","Start with the first decision. We’ll work through the rest together.","Pause here and try it with an example of your own."],P,1,87,18)
    b.frame(1134,201,418,516,"05  Portrait · Representative illustration")
    avatar(b,1156,224,374,356)
    b.paragraph(1156,624,"ADU’s teacher and training avatar",365,22,True)
    b.paragraph(1156,689,"An approachable guide to unfamiliar material.",358,19)
    group(b,1134,764,418,130,"06  Name",["Addie"],G,1,76,24)
    b.save("addie-persona")

def course_intake():
    b=Board("People Management · Ingest workshop","ADU / PM Training · 01 Ingest · Outcomes, content ideas and learner resources","58%")
    group(b,112,197,215,673,"Parking lot",["","",""],P,1,95,18)
    group(b,351,197,1199,180,"01  Define learner outcomes",["Set clear expectations across work settings","Support employee growth and career conversations","Recognize when an issue needs additional support"],Y,3,91,19)
    b.frame(351,417,1199,280,"02  Content brainstorm")
    columns=[("Managing people",["Set expectations across work settings","Make feedback a regular practice"]),("Developing talent",["Coach through everyday work","Identify skills to build"]),("Career progression",["Discuss readiness and growth paths","Make development plans concrete"]),("Conflict resolution",["Address friction early","Focus on observable behavior"]),("Progressive discipline",["Document concerns factually","Clarify who can help"])]
    for i,(title,items) in enumerate(columns):
        x=371+i*234
        b.paragraph(x,452,title,222,17,True)
        notes(b,x,478,212,75,items,B,1,17,13)
    group(b,351,741,1199,129,"03  Identify learner resources",["Manager Portal","Performance guidance","Career ladders","Policy and process library"],G,4,65,17)
    b.save("pm-intake")

def course_outline():
    b=Board("People Management · Outline review","ADU / PM Training · 02 Outline workshop · SME and team review for a 10-minute module","58%")
    sections=[
        ("Managing people","Clarify what managers own in everyday team leadership.","Routine one-on-ones"),
        ("Developing talent","Connect feedback and coaching with development goals.","Resources for professional growth"),
        ("Career progression","Support career conversations and development planning.",None),
        ("Conflict resolution","Cover early recognition and constructive discussion.",None),
        ("Progressive discipline","Explain where documentation fits in a support process.","Examples of documentation"),
        ("Resources & escalation","Help managers identify the right support for a situation.","When to involve People Operations"),
        ("Manager takeaway","Summarize actions managers can apply after the lesson.","Distinguish routine from sensitive issues"),
        ("Supporting improvement","Frame correction around clear expectations and follow-through.",None),
    ]
    for i,(title,body,review) in enumerate(sections):
        x=112+i%4*365;y=201+i//4*346
        b.frame(x,y,346,316,f"{i+1:02}  Outline section")
        b.paragraph(x+18,y+41,title,310,22,True)
        b.paragraph(x+18,y+105,body,310,18)
        if review:
            b.note(x+18,y+190,310,95,review,Y,18)
    b.text(112,892,"Next step  →  Draft the script from the reviewed outline, then send it to the SME to check accuracy and fill gaps.",17,True,MUTED)
    b.save("pm-outline")

def storyboard():
    b=Board("Procurement & Vendor Management · Storyboard","ADU / PM Training · 04 Storyboard · Six scene sketches paired with the reviewed script","58%")
    scenes=[
        ("Purchasing responsibilities","Introduce the purchasing role and how it supports the company."),
        ("Procurement-led actions","Explain the types of decisions Procurement handles."),
        ("Scope boundaries","Distinguish purchasing responsibilities from related work."),
        ("Define the need","Show how teams describe what they need before contracting."),
        ("Early coordination","Show where early engagement helps teams align."),
        ("Close and transition","Recap responsibilities and cue the next part of the lesson."),
    ]
    for i,(title,body) in enumerate(scenes):
        x=112+i%3*485;y=208+i//3*350
        b.frame(x,y,465,314,f"Scene {i+1:02}  ·  {'Authority and scope' if i<3 else 'Working together'}")
        b.rect(x+14,y+14,437,150,"#EEF1F8")
        presenter = i != 4
        if presenter:
            portrait_x = x+14 if i in (2,3) else x+285
            avatar(b,portrait_x,y+14,166,150)
        title_x = x+196 if i in (2,3) else x+30
        b.text(title_x,y+39,"PROGRAM MANAGER TRAINING",11,True,MUTED)
        b.paragraph(title_x,y+70,title,236 if presenter else 390,23,True)
        if not presenter:
            labels = ("Describe need","Align early","Coordinate")
            for j,label in enumerate(labels):
                node_x=x+30+j*138
                b.rect(node_x,y+105,118,35,"#FFFFFF","#C5CEE5",4)
                b.text(node_x+59,y+127,label,13,True,INK,"middle")
                if j<2:b.arrow(node_x+118,y+122,node_x+136,y+122)
        b.text(x+16,y+192,"NARRATION SUMMARY",13,True,MUTED)
        b.paragraph(x+16,y+222,body,427,19)
        b.text(x+16,y+294,"Notional visual · SME may suggest an existing asset",14,False,MUTED)
    b.text(112,906,"Next step  →  Build production-ready graphics in Figma for video production in HeyGen.",17,True,MUTED)
    b.save("procurement-storyboard")

if __name__ == "__main__":
    for draw in (discovery,inventory,intake,process,gap,workflow,persona,course_intake,course_outline,storyboard):
        draw()

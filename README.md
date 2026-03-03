![header(1)](https://github.com/moisturicer/presyoani/blob/main/apps/buyer-dashboard/public/images/header.JPG)

<div align="center">
  <h1>Innovation Cup Cebu 2026 Hackathon</h1>
</div>

<div align="center">
  <h3>Team Random Access Members</h3>
</div>

<div align="center">
  <table border="1" cellspacing="0" cellpadding="10">
    <tr>
      <th>Avatar</th>
      <th>Name</th>
      <th>GitHub Username</th>
      <th>Contributions</th>
    </tr>
    <tr>
      <td><img src="https://avatars.githubusercontent.com/u/170021023?v=4" width="50" height="50" style="border-radius:50%;" /></td>
      <td><b>Hermoine Zozobrado</b></td>
      <td>@moisturicer</td>
      <td>Project Lead, AI Integration, PWA Developer</td>
    </tr>
    <tr>
      <td><img src="https://avatars.githubusercontent.com/u/134838637?s=60&v=4" width="50" height="50" style="border-radius:50%;" /></td>
      <td><b>Lovely Ong</b></td>
      <td>@xienshane</td>
      <td>Lead Backend, Webhook Developer, FastAPI</td>
    </tr>
    <tr>
      <td><img src="https://avatars.githubusercontent.com/u/185739509?v=4" width="50" height="50" style="border-radius:50%;" /></td>
      <td><b>Rainne Borromeo</b></td>
      <td>@choclitshake</td>
      <td>Data Engineer, Web Scraping, FastAPI</td>
    </tr>
    <tr>
      <td><img src="https://avatars.githubusercontent.com/u/143606848?v=4" width="50" height="50" style="border-radius:50%;" /></td>
      <td><b>Nathanael Del Castillo</b></td>
      <td>@doinath</td>
      <td>Main Backend, Systems Architect, APIs</td>
    </tr>
    <tr>
      <td><img src="https://avatars.githubusercontent.com/u/75629760?v=4" width="50" height="50" style="border-radius:50%;" /></td>
      <td><b>Clark Modequillo</b></td>
      <td>@clorkies</td>
      <td>UI/UX, Frontend Developer</td>
    </tr>
  </table>
</div>

<hr />

<h2>About the Project 🌱</h2>
<p><b>PresyoAni</b> is an offline-capable digital AI assistant that empowers rural producers by providing instant quality grading, market price transparency, and direct access to buyers through Messenger. <br><br><i>⚠️ This is a hackathon project. Features may be buggy or incomplete.</i></p>

<hr />

<h2>🎯 Problem Statement</h2>
<p>Rural farmers in the Philippines often lack reliable internet access, making them vulnerable to exploitative middlemen. Without real-time access to daily market prices (DPI) and a standardized way to grade their crops, farmers are forced to sell their produce at significantly lower margins.</p>

<hr />


<h2>🌉 The Digital Gap</h2>
<p>Recent data shows that <b>69% of Filipino farmers already own smartphones</b>. However, a massive disconnect remains: almost all modern agribusiness tools, pricing platforms, and AI solutions require a stable 4G/5G internet connection—a luxury rarely available in remote farmlands.</p>
<p>The hardware is already in their pockets, but the software fails them when they lose signal. <b>PresyoAni bridges this exact gap.</b> By shifting heavy AI processing offline (Edge Computing) and utilizing the "Free Data" Messenger networks already popular in the Philippines, we deliver high-tech agricultural tools to zero-bandwidth environments.</p>

<hr />

<h2>💡 Our Solution</h2>
<p>PresyoAni bridges the digital divide by using an <b>offline-first Progressive Web App (PWA)</b>. Farmers can scan their crops (like tomatoes, chilies, and sweet potatoes) without an internet connection. The AI grades the crop locally on their device and generates a lightweight text code.</p>
<p>The farmer can then paste this code into <b>Facebook Messenger (which works on Free Data promos)</b> to receive the latest market prices and instantly list their produce in a digital marketplace accessible to buyers.</p>

<hr />

<h2>🕹 Key Features</h2>
<ul>
  <li><b>Offline AI Crop Grading:</b> Edge AI (TensorFlow Lite) evaluates crop quality directly on the phone's CPU, requiring zero internet connectivity.</li>
  <li><b>"Free Data" Integration:</b> Works seamlessly with Philippine telecom "Free Facebook/Messenger" promos using text-based hash codes instead of heavy web links.</li>
  <li><b>Real-Time Price Scraping:</b> Automated web scraping of the Department of Agriculture's daily price index (DPI) to ensure fair pricing.</li>
  <li><b>Integrated Marketplace Platform:</b> A seamless ecosystem where farmers list their AI-graded crops via the "Free Data" Messenger bot, which automatically syncs to a dedicated marketplace website where buyers can browse, verify the AI grades, and place orders directly.</li>
</ul>

<hr />

<h2>💰 Revenue Streams & Monetization</h2>
<p>PresyoAni operates on a multi-tier revenue model that monetizes the data, trust, and efficiency our platform creates. By providing value to institutional buyers, corporate entities, and government agencies, we ensure a sustainable and profitable ecosystem.</p>

<ul>
  <li><b>Strategic Marketplace Matching Fees:</b> Institutional buyers (hotels, restaurants, and food processors) pay a success-based matching fee whenever the platform facilitates bulk procurement directly from farmers. This reduces their sourcing costs while providing PresyoAni with a steady stream of transaction-based revenue.</li>
  
  <li><b>Corporate ESG & Sustainability Subscriptions:</b> Large corporations pay a monthly subscription for digital transparency reports. These "Fair-Trade" analytics provide verifiable data on their supply chain, helping them meet <b>ESG (Environmental, Social, and Governance)</b> goals and prove their direct impact on rural farmer livelihoods.</li>

  <li><b>Public Sector Data-as-a-Service (DaaS):</b> We provide government agencies (such as the Department of Agriculture) with licensed access to a real-time "Agri-Map." This live dashboard tracks crop yields, harvest locations, and quality grades, enabling the government to predict supply gluts, prevent price spikes, and manage national food security with actual field data.</li>

  <li><b>Agri-Cooperative SaaS Dashboard:</b> Agricultural cooperatives pay a monthly SaaS (Software-as-a-Service) fee to access a centralized management dashboard. This tool allows co-op leaders to track the collective output of all their members in real-time, allowing them to consolidate harvests and negotiate significantly better wholesale prices.</li>
</ul>


<hr />
<h2>🚀 Scalability & Future Expansion</h2>
<p>The true power of the PresyoAni architecture is its modularity. While our MVP focuses on high-value crops, our core infrastructure—<b>Offline Edge AI combined with zero-bandwidth Messenger integration</b>—can easily scale to other vital Philippine industries.</p>
<p>Because the AI "brain" is just a swappable <code>.tflite</code> file, we can rapidly expand to:</p>
<ul>
  <li><b>🐟 Fisheries & Aquaculture:</b> Fishermen can grade catch freshness (e.g., analyzing eye clarity or gill color of Tuna/Bangus) and log their haul sizes while still out at sea with zero cell service.</li>
  <li><b>🐔 Poultry & Livestock:</b> Poultry farmers can automate egg size classification, grade meat cuts, or even use early-detection visual AI for visible livestock diseases.</li>
  <li><b>🌾 Supply Chain Verification:</b> Expanding the marketplace to include logistics partners who can scan the exact same offline codes to verify the quality of goods during transport.</li>
</ul>

<hr />
<h2>🛠 Tech Stack</h2>
<ul>
  <li><b>Frontend (Farmer Offline Scanner):</b> HTML5, Vanilla JavaScript, CSS (PWA + Service Workers)</li>
  <li><b>Frontend (Buyer Marketplace Website):</b> React.js, Tailwind CSS</li>
  <li><b>Backend & Webhooks:</b> Python, FastAPI, Uvicorn</li>
  <li><b>Database:</b> Supabase (PostgreSQL)</li>
  <li><b>Edge AI & Model Training:</b> Roboflow (Dataset Management), Google Colab (Model Training), TensorFlow Lite / WebAssembly (Offline Edge Inference)</li>
  <li><b>Integrations:</b> Meta Graph API (Messenger Bot), Python Web Scraping (HTTPX/BeautifulSoup)</li>
  <li><b>Deployment & Cloud:</b> Render (FastAPI Backend & PWA Hosting), Vercel (React Website Hosting)</li>
</ul>

<hr />

<h2>📜 License & Copyright</h2>
<p><b>© 2026 Team Random Access Members. All Rights Reserved.</b></p>
<p>This project, including its source code, concepts, algorithms, and UI/UX design, is proprietary. Unauthorized copying, modification, distribution, or commercial use of this repository or its underlying ideas is strictly prohibited.</p>

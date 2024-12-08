const { query: Hasura } = require('./src/utils/hasura');

const emails = [
  'msadavarthi@gmail.com',
  'Navaneethvn9@gmail.com',
  'monish.cs22@bmsce.ac.in',
  'mogaveera.cs22@bmsce.ac.in',
  'Manojmkj98806@gmail.com',
  'gouthamtech66@gmail.com',
  'mohammedkalandar.cs23@bmsce.ac.in',
  'khushinataraj28@gmail.com',
  'hitha22harish@gmail.com',
  'jiyagupta.cs23@bmsce.ac.in',
  'palepuvishal.cs23@bmsce.ac.in',
  'gajalakshmi.shashir@gmail.com',
  'navneetkumar.cs23@bmsce.ac.in',
  'mdsulaymanzain2@gmail.com',
  'shresthabipa@gmail.com',
  'sbisista@gmail.com',
  'arnavomg@gmail.com',
  'mohitkumar.cs23@bmsce.ac.in',
  'sbisista@gmail.com',
  'shresthabipa@gmail.com',
  'kumar.ec21@bmsce.ac.in',
  'harshab6622@gmail.com',
  'parmeetsingh.ec23@bmsce.ac.in',
  'Sanchitmehta825@gmail.com',
  'yashasj050205@gmail.com',
  'kishorechandra.cs23@bmsce.ac.in',
  'mohammedabdul.cs23@bmsce.ac.in',
  'koushiktanu1234@gmail.com',
  'aryanvin07@gmail.com',
  'thanushreem2008@gmail.com',
  'maheshtanu1971@gmail.com',
  'likhithd.cs23@bmsce.ac.in',
  'muppidisai.cs23@bmsce.ac.in',
  'yemmignurabdul@gmail.com',
  'mohitkumar.cs23@bmsce.ac.in',
  'msshailesh.cs23@bmsce.ac.in',
  'Devansh.te23@bmsce.ac.in',
  'kaustubhtulsyan.is23@bmsce.ac.in',
  'ashmitgupta.ci23@bmsce.ac.in',
  'mukheshdn.cs23@bmsce.ac.in',
  'ayushnarayan.is23@bmsce.ac.in',
  'shobhitpandey.is23@bmsce.ac.in',
  'nvijaya151@gmail.com',
  'vijayanarrasimha567@gmail.com',
  'samarthpv69@gmail.com',
  'gowshikrajan790@gmail.com',
  'criticaltristen32@gmail.com',
  'mithunmounish9@gmail.com',
  'karthikgr0296@gmail.com',
  'harshithahg.cs23@bmsce.ac.in',
  'dyuthi.cs23@bmsce.ac.in',
  'maheshlamani.cs23@bmsce.ac.in',
  'navirathnavi@gmail.com',
  'amitraksharmukherjee@gmail.com',
  'korean@gmail.com',
  'gagandeeplt.cs24@bmsce.ac.in',
  'kshitizofficial21@gmail.com',
  'Shouryakharwal.cs24@bmsce.ac.in',
  'kavanama185@gmail.com',
  'idrees.cs23@bmsce.ac.in',
  'chethanks.cs23@bmsce.ac.in',
  'kavana.ma01@gmail.com',
  'hiranhirendra@gmail.com',
  'Irfansudarani.cs23@bmsce.ac.in',
  'kamireddy.cs23@bmsce.ac.in',
  'eashanjainv@gmail.com',
  'kavanama.cs23@bmsce.ac.in',
  'jawinroys.cs23@bmsce.ac.in',
  'Hemanshu.cs23@bmsce.ac.in',
  'chethanac.cs23@bmsce.ac.in',
  'daivya.cs23@bmsce.ac.in',
  'bhoomikabg.cs23@bmsce.ac.in',
  'crevanneil.cs23@bmsce.ac.in',
  'irfansudarani.cs23@bmsce.ac.in',
  'chethanac755@gmail.com',
  'Dhruhi04@gmail.com',
  'kotiankrithika0@gmail.com',
  'dachethan.cs23@bmsce.ac.in',
  'chethantm.cs23@bmsce.ac.in',
  'eashanjainv@gmail.com',
  'ikshitha.premananth@gmail.com',
  'eashanjain.cs23@bmsce.ac.in',
  'laxmibandi.cs23@bmsce.ac.in',
  'shreyasdk.is22@bmsce.ac.in',
  'me@aayush-agrawal.com',
  'bprabhanjan.cs23@bmsce.ac.in',
  'Navneetpitani@gmail.com',
  'govindsingh.cs23@bmsce.ac.in',
  'karansuresh.cs23@bmsce.ac.in',
  'lakshya.cs23@bmsce.ac.in',
  'Kishleysharma.cs23@bmsce.ac.in',
  'darshanyg.cs23@bmsce.ac.in',
  'Lakshithp.cs23@bmsce.ac.in',
  'danish.cs23@bmsce.ac.in',
  'lavanyass.cs23@bmsce.ac.in',
  'jiyanitturkar.cs23@bmsce.ac.in',
  'kashviagarwal.cs23@bmsce.ac.in',
  'kanishkasharma.cs23@bmsce.ac.in',
  'nidhipramod.cs23@bmsce.ac.in',
  'lakshayjuneja.cs23@bmsce.ac.in',
  'sakethk4106@gmail.com',
  'arpitphusro201005@gmail.com',
  'naveenkumarpn.cs23@bmsce.ac.in',
  'alok.cs23@bmsce.ac.in',
  'ishitagupta.is23@bmsce.ac.in',
  'chaudharykartik311@gmail.com',
  'irfansudarani.cs23@bmsce.ac.in',
  'tanishq.garg20@gmail.com',
  'maheshlamani.cs23@bmsce.ac.in',
  'diya.choudhary293@gmail.com',
  'aishwaryaraj5533@gmail.com',
  'prajwalanilkumar1@gmail.com',
  'nakul.k.5605@gmail.com',
  'kritibhatnagar86@gmail.com',
  'edwinappu492@gmail.com',
  'pranaveaswar.cd23@bmsce.ac.in',
  'ikshithap.cs23@bmsce.ac.in',
  'deepak.jpr11@gmail.com',
  'anjugupta2310@gmail.com',
  'maliknajeeb113@gmail.com',
  'shakti.mathur6@gmail.com',
  'sarikamishra184@gmail.com',
  'neenagupta@gmail.com',
  'payaldanny1808@gmail.com',
  'rishitmakadia.cs23@bmsce.ac.in',
  'nishanthpadigar3@gmail.com',
  'tanikagoyal@gmail.com',
  'mahikabhatnagar2966@gmail.com',
  'harshab.cs23@bmsce.ac.in',
  'hithaharish.cs23@bmsce.ac.in',
  'ayushkiyo75@gmail.com',
  'dishakeshava06@gmail.com',
  'badasinchana@gmail.com',
  'subhashn021@gmail.com',
  'tanushree.m322@gmail.com',
  'yuvarajhr2006@gmail.com',
  'adithyapatil.cs24@bmsce.ac.in',
  'prlaxmi_1909@gmail.com',
  'nehact.ec23@bmsce.ac.in',
  'tanmayarajesh26@gmail.com',
  'barathganeshsbp.ec24@rvce.edu.in',
  'adithyab.cs24@bmsce.ac.in',
  'shraddhadk.cs24@bmsce.ac.in',
  'asthasateesh.ec23@bmsce.ac.in',
  'samruddheehp.se24@bmsce.ac.in',
  'prathvikshetty1706@gmail.com',
  'nidhisshetty303@gmail.com',
  'nidhishrinayak.cs24@bmsce.ac.in',
  'poorvinaveen3101@gmail.com',
  'teamgaurav7@gmail.com',
  'bhoomikabg.cs23@bmsce.ac.in',
  'Sahare0507@gmail.com',
  'ravishankarakp.y@gmail.com',
  'aniketanmanjunath.ad24@bmsce.ac.in',
  'gayathris.cs24@bmsce.ac.in',
  'chethinchu@gmail.com',
  'koushiktanu2005@gmail.com',
];

const checkIfUserExists = async (emails) => {
  const query = `query checkIfUserEmailExists($emails: [String!]!) {
    user(where: {
      email_id: {
        _in: $emails
      }
    }) {
      email_id
    }
  }`;

  try {
    // Assuming you're using a GraphQL client like Apollo or Hasura client
    const response = await Hasura(query, { emails });

    // The response will contain emails that exist in the database
    const existingEmails = response.result.data.user.map((user) => user.email_id);

    // Find emails that do not exist in the database
    const nonExistingEmails = emails.filter((email) => !existingEmails.includes(email));

    return {
      existingEmails,
      nonExistingEmails,
      totalEmails: emails.length,
      existingCount: existingEmails.length,
      nonExistingCount: nonExistingEmails.length,
    };
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};

checkIfUserExists(emails)
  .then((result) => {
    console.log('Existing emails:', result.existingEmails);
    console.log('Non-existing emails:', result.nonExistingEmails);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

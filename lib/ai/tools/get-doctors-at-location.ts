import { tool } from "ai";
import { z } from "zod";

export const getDoctorsAtLocation = tool({
  description:
    "Get the list of doctors available at a specific clinic location. Call this after the patient selects a clinic location during appointment booking.",
  inputSchema: z.object({
    patientId: z.string().describe("The verified patient's unique identifier"),
    locationId: z.string().describe("The selected clinic location ID (fac_id)"),
    locationName: z.string().describe("The selected clinic location name"),
    lat: z.number().describe("Latitude of the selected clinic location"),
    lng: z.number().describe("Longitude of the selected clinic location"),
  }),
  execute: ({ patientId, locationId, locationName }) => {
    try {
      const response = {
        more: false,
        prov_list: [
          {
            provider_npi: "1093678211",
            provider_fname: "BEEVA",
            provider_lname: "CHUDAL",
            provider_gender: "female",
            provider_degree: "FNP",
            professional_statement:
              "With over 13 years of nursing experience, she has worked across diverse healthcare settings, including progressive care units, home health, and outpatient surgery clinics. Her clinical interests include preventive medicine, wellness, medically assisted weight loss, and partnering with patients to achieve their personal health goals.",
            provider_speciality: "Nurse Practitioner",
            languages: "English",
            provider_pic_url:
              "/apps/ECWImgProcessor?action=providerProfile&npi=1093678211",
            provider_enc_npi: "QYLry2raWY8Qyn3b",
            accept_new_patients: 1,
          },
          {
            provider_npi: "1407525777",
            provider_fname: "ELIZABETH",
            provider_lname: "RAMIREZ",
            provider_gender: "female",
            provider_degree: "FNP",
            professional_statement:
              "Elizabeth was born and raised in Fort Worth.  She knew in elementary school she wanted to pursue a healthcare degree and thus went to the High School of Medical Professions at Northside.  From there she attended Tarrant County College where she obtained her Associates degree in Nursing and continued her studies at Texas Tech University Health Science Center to obtain both her Bachelors degree followed by her Masters degree as a Family Nurse Practitioner.  ",
            provider_speciality: "Nurse Practitioner",
            languages: "English,Spanish",
            provider_pic_url:
              "/apps/ECWImgProcessor?action=providerProfile&npi=1407525777",
            provider_enc_npi: "Aq5rGR366mzlkxWV",
            accept_new_patients: 1,
          },
          {
            provider_npi: "1386373306",
            provider_fname: "FE ANN",
            provider_lname: "BRAXTON",
            provider_gender: "female",
            provider_degree: "FNP",
            professional_statement:
              "Fe Ann got married and moved to Texas in 2017, where she worked in various areas in the nursing field. While pursuing her nursing career, she advanced her education and became a certified nurse practitioner. Through her studies, she managed to be a wife and a mother to two beautiful girls. Fe Ann specializes in preventative medicine, weight loss, sick visits, HRTs, and general health and wellness.",
            provider_speciality: "Nurse Practitioner",
            languages: "English",
            provider_pic_url:
              "/apps/ECWImgProcessor?action=providerProfile&npi=1386373306",
            provider_enc_npi: "LoQp7xKxMODay6W0",
            accept_new_patients: 1,
          },
          {
            provider_npi: "1275641342",
            provider_fname: "KRISTEN",
            provider_lname: "BOLTON",
            provider_gender: "female",
            provider_degree: "PA-C",
            professional_statement:
              "Kristen is a Certified Physician Assistant that has been a family medicine provider for over 20  years. She graduated from Baylor University and then ventured out of Texas to pursue her degree in physician assistant studies from University of Saint Francis in Fort Wayne, Indiana. She worked in an urgent care office for a few years before moving into family medicine. Kristen loves the ongoing relationships she develops with her patients and working with them to help them live a healthy life.\n",
            provider_speciality: "Internal Medicine",
            languages: "English",
            provider_pic_url:
              "/apps/ECWImgProcessor?action=providerProfile&npi=1275641342",
            provider_enc_npi: "8JlD7DvZad6Ak6me",
            accept_new_patients: 1,
          },
          {
            provider_npi: "1528559325",
            provider_fname: "MERENE",
            provider_lname: "THOMAS",
            provider_gender: "female",
            provider_degree: "DO",
            professional_statement:
              "Dr. Merene Thomas grew up in New Jersey and moved to the Dallas - Fort Worth metropolitan area in 2021. After graduating from Rowan University School of Osteopathic Medicine in Stratford, NJ in 2018, she completed her Family Medicine Residency at Carepoint Health - Christ Hospital in Jersey City, NJ. She is board certified in Family Medicine.\n\n\nShe is committed to providing patient-centered care with a focus on preventative health. She is grateful to serve her community and build strong relation",
            provider_speciality: "Family Medicine",
            languages: "English,Indian (includes Hindi & Tamil)",
            provider_pic_url:
              "/apps/ECWImgProcessor?action=providerProfile&npi=1528559325",
            provider_enc_npi: "EBbXGzPd3PYByLj1",
            accept_new_patients: 1,
          },
          {
            provider_npi: "1396068870",
            provider_fname: "RADHIKA",
            provider_lname: "VAYANI",
            provider_gender: "female",
            provider_degree: "DO",
            professional_statement:
              "Dr. Radhika Vayani is a warm and compassionate primary care doctor specializing in internal medicine caters to the communities of Fort Worth and Keller Texas. She attended the University of North Texas, where she received her medical degree, and completed her residency in internal medicine at the Plaza Medical Center of Fort Worth.\nShe is board certified by the American Osteopathic Board of Internal Medicine. ",
            provider_speciality: "Internal Medicine",
            languages: "English",
            provider_pic_url:
              "/apps/ECWImgProcessor?action=providerProfile&npi=1396068870",
            provider_enc_npi: "MpLVyW9jjlxoGrd5",
            accept_new_patients: 1,
          },
        ],
      };

      const provList = response.prov_list as Array<{
        provider_enc_npi: string;
        provider_fname: string;
        provider_lname: string;
        provider_degree: string;
        provider_gender: string;
        provider_speciality: string;
        provider_npi: string;
        provider_pic_url: string;
        accept_new_patients: number;
        languages: string;
        professional_statement: string;
      }>;

      const doctors = provList.map((prov) => ({
        id: prov.provider_enc_npi,
        name: `${prov.provider_fname} ${prov.provider_lname}`,
        degree: prov.provider_degree,
        gender: prov.provider_gender,
        specialty: prov.provider_speciality,
        npi: prov.provider_npi,
        photoUrl: `https://healow.com${prov.provider_pic_url}`,
        acceptingNewPatients: prov.accept_new_patients === 1,
        languages: prov.languages,
        bio: prov.professional_statement,
      }));

      return { patientId, locationId, locationName, doctors };
    } catch (err) {
      return { error: (err as Error).message };
    }
  },
});

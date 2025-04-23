export const mockData = [
  {
    analysisId: 'analysis-001',
    filename: 'sample_001.mzML',
    uploadDate: '2025-04-20',
    speciesResult: {
      species: 'Klebsiella pneumoniae',
      probability: 91,
      chartData: {
        labels: ['Klebsiella pneumoniae', 'Pseudomonas aeruginosa', 'Enterobacter cloacae', 'Staphylococcus aureus', 'Enterococcus faecium'],
        datasets: [
          {
            label: '菌種機率 (%)',
            data: [91, 34, 22, 17, 10],
          },
        ],
      },
    },
    resistanceResult: {
      species: 'Klebsiella pneumoniae',
      resistantTo: ['Ceftriaxone', 'Cefepime', 'Meropenem'],
      chartData: {
        labels: ['Amoxicillin-Clavulanic acid', 'Cefepime', 'Ceftriaxone', 'Ciprofloxacin', 'Imipenem'],
        datasets: [
          {
            label: '抗藥性程度',
            data: [65, 88, 92, 40, 70],
          },
        ],
      },
    },
    speciesFeatures: {
      pseudoIonImage: '/images/grad_cam.png',
      msSpectrumImage: '/images/spectrum.png',
    },
    resistanceFeatures: {
      pseudoIonImage: '/images/grad_cam.png',
      msSpectrumImage: '/images/spectrum.png',
    },
  },
  {
    analysisId: 'analysis-002',
    filename: 'sample_002.mzML',
    uploadDate: '2025-04-21',
    speciesResult: {
      species: 'Pseudomonas aeruginosa',
      probability: 87,
      chartData: {
        labels: ['Pseudomonas aeruginosa', 'Klebsiella pneumoniae', 'Enterobacter cloacae', 'Enterobacter aerogenes', 'Staphylococcus aureus'],
        datasets: [
          {
            label: '菌種機率 (%)',
            data: [87, 30, 25, 18, 15],
          },
        ],
      },
    },
    resistanceResult: {
      species: 'Pseudomonas aeruginosa',
      resistantTo: ['Imipenem', 'Piperacillin-Tazobactam'],
      chartData: {
        labels: ['Imipenem', 'Meropenem', 'Cefepime', 'Ciprofloxacin', 'Piperacillin-Tazobactam'],
        datasets: [
          {
            label: '抗藥性程度',
            data: [90, 85, 60, 40, 88],
          },
        ],
      },
    },
    speciesFeatures: {
      pseudoIonImage: '/images/grad_cam.png',
      msSpectrumImage: '/images/spectrum.png',
    },
    resistanceFeatures: {
      pseudoIonImage: '/images/grad_cam.png',
      msSpectrumImage: '/images/spectrum.png',
    },
  },
  {
    analysisId: 'analysis-003',
    filename: 'sample_003.mzML',
    uploadDate: '2025-04-22',
    speciesResult: {
      species: 'Enterococcus faecium',
      probability: 82,
      chartData: {
        labels: ['Enterococcus faecium', 'Staphylococcus aureus', 'Enterobacter cloacae', 'Klebsiella pneumoniae', 'Pseudomonas aeruginosa'],
        datasets: [
          {
            label: '菌種機率 (%)',
            data: [82, 27, 21, 17, 14],
          },
        ],
      },
    },
    resistanceResult: {
      species: 'Enterococcus faecium',
      resistantTo: ['Ciprofloxacin', 'Clindamycin'],
      chartData: {
        labels: ['Ciprofloxacin', 'Clindamycin', 'Amoxicillin-Clavulanic acid', 'Ceftriaxone', 'Meropenem'],
        datasets: [
          {
            label: '抗藥性程度',
            data: [75, 89, 40, 30, 45],
          },
        ],
      },
    },
    speciesFeatures: {
      pseudoIonImage: '/images/grad_cam.png',
      msSpectrumImage: '/images/spectrum.png',
    },
    resistanceFeatures: {
      pseudoIonImage: '/images/grad_cam.png',
      msSpectrumImage: '/images/spectrum.png',
    },
  }
];

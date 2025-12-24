
const calculateCost = (req, res) => {
    try {
        const { city } = req.body;

        if (!city) {
            return res.status(400).json({
                status: 'fail',
                message: 'City is required'
            });
        }

        // Normalisasi teks (kecilkan huruf & hapus spasi)
        const normalizedCity = city.toLowerCase().trim();

        // LOGIKA MOCKUP ONGKIR (Simulasi)
        // Anda bisa menambahkan kota lain di sini
        const rates = {
            "jakarta": 10000,
            "bogor": 15000,
            "depok": 15000,
            "tangerang": 15000,
            "bekasi": 15000,
            "bandung": 20000,
            "surabaya": 35000,
            "yogyakarta": 30000,
            "semarang": 25000,
            "medan": 45000,
            "bali": 40000,
            "denpasar": 40000,
            "makassar": 50000
        };

        // Jika kota tidak ada di list, pakai harga default (Luar Pulau)
        const cost = rates[normalizedCity] || 55000;

        return res.status(200).json({
            status: 'success',
            data: {
                city: city,
                cost: cost,
                currency: "IDR"
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = { calculateCost };
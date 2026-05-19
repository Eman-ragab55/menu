export const menuData = {
  categories: [
    { id: 'all', name: { en: 'All', ar: 'الكل' } },
    { id: 'appetizers', name: { en: 'Appetizers', ar: 'المقبلات' } },
    { id: 'main', name: { en: 'Main Courses', ar: 'الأطباق الرئيسية' } },
    { id: 'desserts', name: { en: 'Desserts', ar: 'الحلويات' } },
    { id: 'bar', name: { en: 'Bar', ar: 'البار' } }
  ],
  dishes: [
    // --- Appetizers (7 Items) ---
    { id: 'a1', category: 'appetizers', name: { en: 'Saffron Burrata', ar: 'سافرون بوراتا' }, price: 320, image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600' },
    { id: 'a2', category: 'appetizers', name: { en: 'Wagyu Tartare', ar: 'واجيو تارتار' }, price: 550, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },
    { id: 'a3', category: 'appetizers', name: { en: 'Lobster Bisque', ar: 'لوبستر بيسك' }, price: 410, image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&q=80&w=600' },
    { id: 'a4', category: 'appetizers', name: { en: 'Truffle Bone Marrow', ar: 'نخاع العظم بالترافل' }, price: 380, image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=600' },
    { id: 'a5', category: 'appetizers', name: { en: 'Octopus Carpaccio', ar: 'كرباتشو الأخطبوط' }, price: 450, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=600' },
    { id: 'a6', category: 'appetizers', name: { en: 'Truffle Arancini', ar: 'أرانشيني بالترافل' }, price: 290, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=600' },
    { id: 'a7', category: 'appetizers', name: { en: 'Seared Foie Gras', ar: 'فوا جرا مشوح' }, price: 680, image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f06?auto=format&fit=crop&q=80&w=600' },

    // --- Main Courses (9 Items) ---
    { id: 'm1', category: 'main', name: { en: 'Tomahawk Ribeye', ar: 'توماهوك ريب آي' }, price: 2400, image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=600' },
    { id: 'm2', category: 'main', name: { en: 'Black Truffle Risotto', ar: 'ريزوتو الترافل' }, price: 820, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=600' },
    { id: 'm3', category: 'main', name: { en: 'Miso Glazed Cod', ar: 'سمك القد بالميسو' }, price: 950, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600' },
    { id: 'm4', category: 'main', name: { en: 'Hokkaido Scallops', ar: 'هوكايدو سكالوب' }, price: 740, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=600' },
    { id: 'm5', category: 'main', name: { en: 'Lamb Chops Noir', ar: 'ريش غنم نوار' }, price: 880, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=600' },
    { id: 'm6', category: 'main', name: { en: 'Duck Breast Spiced', ar: 'صدر بط متبل' }, price: 760, image: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&q=80&w=600' },
    { id: 'm7', category: 'main', name: { en: 'Wagyu Gold Burger', ar: 'برجر واجيو ذهبي' }, price: 620, image: 'https://images.unsplash.com/photo-1550317138-10000687ad32?auto=format&fit=crop&q=80&w=600' },
    { id: 'm8', category: 'main', name: { en: 'Lobster Tagliatelle', ar: 'تالياتيلي الاستاكوزا' }, price: 890, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600' },
    { id: 'm9', category: 'main', name: { en: 'Black Angus Fillet', ar: 'فيليه بلاك أنجوس' }, price: 1100, image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=600' },

    // --- Desserts (5 Items) ---
    { id: 'e1', category: 'desserts', name: { en: 'Gold Leaf Lava', ar: 'لافا كيك بالذهب' }, price: 420, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600' },
    { id: 'e2', category: 'desserts', name: { en: 'Rose Crème Brûlée', ar: 'كريم بروليه الورد' }, price: 350, image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600' },
    { id: 'e3', category: 'desserts', name: { en: 'Pistachio Opera', ar: 'أوبرا الفستق' }, price: 380, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600' },
    { id: 'e4', category: 'desserts', name: { en: 'Deconstructed Tiramisu', ar: 'تيراميسو مبتكر' }, price: 310, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600' },
    { id: 'e5', category: 'desserts', name: { en: 'Saffron Milk Cake', ar: 'كيكة حليب بالزعفران' }, price: 290, image: 'https://images.unsplash.com/photo-1587184946481-9475ed96d27f?auto=format&fit=crop&q=80&w=600' },

    // --- Bar (4 Items) ---
    { id: 'b1', category: 'bar', name: { en: 'Botanical Elixir', ar: 'إكسير الأعشاب' }, price: 240, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600' },
    { id: 'b2', category: 'bar', name: { en: 'Oud Smoke Crimson', ar: 'كريمسون العود' }, price: 290, image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600' },
    { id: 'b3', category: 'bar', name: { en: 'Saffron Mango', ar: 'مانجو بالزعفران' }, price: 260, image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&q=80&w=600' },
    { id: 'b4', category: 'bar', name: { en: 'Smoked Rosemary', ar: 'روزماري مدخن' }, price: 220, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600' }
  ],
  whatsappNumber: '201200417433'
};
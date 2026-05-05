var SUPABASE_URL = "https://wjhugpnjapsyysgsxrtp.supabase.co";
var SUPABASE_KEY = "sb_publishable_zOYqcJMGGvqSFeR5kHT5lg_3xHXoP7s";
var EMAILJS_SERVICE  = "service_5sgcx6a";
var EMAILJS_TEMPLATE = "template_74cg8ho";
var EMAILJS_KEY      = "lxg6X0FF2kADJ5DYR";

var SESSION_KEY = "dg_session";

var MODULES = [
  {key:"oce",nom:"OCE",coef:5},{key:"odf",nom:"ODF",coef:5},
  {key:"paro",nom:"Parodontologie",coef:5},{key:"patho",nom:"Pathologie",coef:5},
  {key:"prothese",nom:"Prothese",coef:5},{key:"imagerie",nom:"Imagerie Medicale",coef:3},
  {key:"anapath",nom:"Anatomie Pathologique",coef:1},{key:"anesthesio",nom:"Anesthesiologie",coef:1},
  {key:"pharmaco",nom:"Pharmacologie",coef:1},{key:"occluso",nom:"Occlusodontie",coef:1},
  {key:"oxyo",nom:"Oxyologie",coef:1}
];

var MOTIV_MSGS = {
  fr: { ex:"🏆 Performance exceptionnelle ! Vous êtes parmi les meilleurs !", gr:"⭐ Excellent travail ! Continuez sur cette lancée !", gd:"👍 Très bien ! Encore un effort pour l'excellence !", ok:"💪 Admis(e) ! Vous pouvez encore améliorer votre rang !", ef:"📚 Ne lâchez pas — chaque point compte !", lo:"🌟 Courage ! Chaque session est une nouvelle chance !" },
  en: { ex:"🏆 Exceptional performance! You're among the best!", gr:"⭐ Excellent work! Keep it up!", gd:"👍 Very good! One more push for excellence!", ok:"💪 Admitted! You can still improve your rank!", ef:"📚 Don't give up — every point counts!", lo:"🌟 Courage! Every session is a new chance!" },
  ar: { ex:"🏆 أداء استثنائي! أنت من بين الأفضل!", gr:"⭐ عمل ممتاز! واصل!", gd:"👍 جيد جداً! جهد إضافي نحو التميز!", ok:"💪 ناجح! يمكنك تحسين ترتيبك!", ef:"📚 لا تستسلم — كل نقطة مهمة!", lo:"🌟 شجاعة! كل دورة هي فرصة جديدة!" }
};

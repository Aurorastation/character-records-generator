using ProtoBuf;
using System;

namespace AuroraRecordGenerator
{
    [ProtoContract]
    public enum SpeciesType
    {
        [ProtoEnum]
        None = 0,

        [ProtoEnum]
        Human,

        [ProtoEnum]
        Skrell,

        [ProtoEnum]
        Tajara,

        [ProtoEnum]
        Unathi,

        [ProtoEnum]
        Vaurca,

        [ProtoEnum]
        Diona,

        [ProtoEnum]
        IPC
    }

    [ProtoContract]
    public enum SpeciesSubType
    {
        [ProtoEnum, SubspeciesMeta(SpeciesType.None, "N/A")]
        None = 0,

        // SKRELL VARIANTS
        [ProtoEnum, SubspeciesMeta(SpeciesType.Skrell, "Axiori", "Ethnicity")]
        SkrellAxiori,
        [ProtoEnum, SubspeciesMeta(SpeciesType.Skrell, "Xiialt", "Ethnicity")]
        SkrellXiialt,
        [ProtoEnum, SubspeciesMeta(SpeciesType.Skrell, "Xiiori", "Ethnicity")]
        SkrellXiiori,

        // TAJARA VARIANTS
        [ProtoEnum, SubspeciesMeta(SpeciesType.Tajara, "Hharar", "Ethnicity")]
        TajaraHharar,
        [ProtoEnum, SubspeciesMeta(SpeciesType.Tajara, "Zhan-Khazan", "Ethnicity")]
        TajaraZhan,
        [ProtoEnum, SubspeciesMeta(SpeciesType.Tajara, "Njarir'Akhran", "Ethnicity")]
        TajaraNjarir,
        [ProtoEnum, SubspeciesMeta(SpeciesType.Tajara, "M'sai", "Ethnicity")]
        TajaraMsai,

        // VAURCA VARIANTS
        [ProtoEnum, SubspeciesMeta(SpeciesType.Vaurca, "Type A (Worker)", "Classification")]
        VaurcaWorker,
        [ProtoEnum, SubspeciesMeta(SpeciesType.Vaurca, "Type B (Warrior)", "Classification")]
        VaurcaWarrior,
        [ProtoEnum, SubspeciesMeta(SpeciesType.Vaurca, "Type C (Breeder)", "Classification")]
        VaurcaBreeder,
        [ProtoEnum, SubspeciesMeta(SpeciesType.Vaurca, "Type E (Bulwark)", "Classification")]
        VaurcaBulwark,

        // IPC VARIANTS
        [ProtoEnum, SubspeciesMeta(SpeciesType.IPC, "Baseline", "Model")]
        IpcBaseline,
        [ProtoEnum, SubspeciesMeta(SpeciesType.IPC, "Shell", "Model")]
        IpcShell,
        [ProtoEnum, SubspeciesMeta(SpeciesType.IPC, "Hephaestus G1 Industrial", "Model")]
        IpcG1,
        [ProtoEnum, SubspeciesMeta(SpeciesType.IPC, "Hephaestus G2 Industrial", "Model")]
        IpcG2,
        [ProtoEnum, SubspeciesMeta(SpeciesType.IPC, "Xion Industrial", "Model")]
        IpcXion,
        [ProtoEnum, SubspeciesMeta(SpeciesType.IPC, "Zeng-Hu Mobility", "Model")]
        IpcZengHu,
        [ProtoEnum, SubspeciesMeta(SpeciesType.IPC, "Bishop Accessory", "Model")]
        IpcBishop,

        // UNATHI VARIANTS
        [ProtoEnum, SubspeciesMeta(SpeciesType.Unathi, "Aut'akh", "Variant")]
        UnathiAutakh,

        // HUMAN VARIANTS
        [ProtoEnum, SubspeciesMeta(SpeciesType.Human, "Offworlder", "Variant")]
        HumanOffworld
    }

    public static class Info
    {
        /// <summary>
        /// The current in-character date.
        /// </summary>
        public static DateTime IcDate => new DateTime(DateTime.Now.Year + 442,
            DateTime.Now.Month,
            DateTime.Now.Day);
    }

    [AttributeUsage(AttributeTargets.Field)]
    public class SubspeciesMetaAttribute : Attribute
    {
        public SpeciesType AssociatedSpecies { get; private set; }
        public string NiceName { get; private set; }
        public string FieldName { get; private set; }
        public SubspeciesMetaAttribute(SpeciesType associatedType, string nicename, string fieldname = "Subspecies")
        {
            AssociatedSpecies = associatedType;
            NiceName = nicename;
            FieldName = fieldname;
        }
    }
}